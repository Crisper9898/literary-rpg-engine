import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { europeCheckpoint } from "../src/content/state/europeReturnState";
import { legacyCheckpoint, legacyState, canBeginLegacy, beginLegacy, chooseCousinResponse,
  finishCousinExchange, collectFamilyLetters, deliverFamilyLetters, chooseJournalistResponse,
  finishJournalistExchange, collectLegacyReport, deliverLegacyReport, finishLegacy } from "../src/content/state/kurtzLegacyState";

afterEach(() => ["europeReturn", "kurtzLegacy"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => europeCheckpoint.write({ phase: "resolved", streetObserved: false,
  reportRead: true, lettersRead: true, response: "private", exchangeSeen: true });
const cousin = () => { ready(); beginLegacy(); chooseCousinResponse("witness"); finishCousinExchange(); };
const journalist = () => { cousin(); collectFamilyLetters(); deliverFamilyLetters(); };

it("requires the Company's completed departure and enters only once", () => {
  expect(canBeginLegacy()).toBe(false); expect(beginLegacy()).toBe(false); ready();
  europeCheckpoint.write({ ...europeCheckpoint.read()!, phase: "offered" }); expect(beginLegacy()).toBe(false);
  ready(); expect(beginLegacy()).toBe(true); expect(legacyState().phase).toBe("cousin");
  expect(beginLegacy()).toBe(false);
});
it.each(["music", "witness"] as const)("%s: cousin reply is immutable; letters require a closed exchange and physical collection", response => {
  ready(); beginLegacy(); expect(collectFamilyLetters()).toBe(false); expect(deliverFamilyLetters()).toBe(false);
  expect(chooseCousinResponse(response)).toBe(true);
  expect(chooseCousinResponse(response === "music" ? "witness" : "music")).toBe(false);
  expect(collectFamilyLetters()).toBe(false); expect(chooseJournalistResponse("party")).toBe(false);
  expect(finishCousinExchange()).toBe(true); expect(finishCousinExchange()).toBe(false);
  expect(deliverFamilyLetters()).toBe(false); expect(collectFamilyLetters()).toBe(true);
  expect(collectFamilyLetters()).toBe(false); expect(deliverFamilyLetters()).toBe(true);
  expect(legacyState()).toEqual({ phase: "journalist", cousinResponse: response });
  expect(deliverFamilyLetters()).toBe(false);
});
it.each(["party", "motive"] as const)("%s: journalist gets only the prepared report; remaining packet must still be examined", response => {
  journalist(); expect(collectLegacyReport()).toBe(false); expect(finishLegacy()).toBe(false);
  expect(chooseJournalistResponse(response)).toBe(true);
  expect(chooseJournalistResponse(response === "party" ? "motive" : "party")).toBe(false);
  expect(collectLegacyReport()).toBe(false); expect(finishJournalistExchange()).toBe(true);
  expect(deliverLegacyReport()).toBe(false); expect(collectLegacyReport()).toBe(true);
  expect(collectLegacyReport()).toBe(false); expect(deliverLegacyReport()).toBe(true);
  expect(legacyState().phase).toBe("remaining"); expect(finishLegacy()).toBe(true);
  expect(legacyState()).toEqual({ phase: "complete", cousinResponse: "witness", journalistResponse: response });
  expect(finishLegacy()).toBe(false); expect(deliverLegacyReport()).toBe(false);
});
it("does not advance through time or finish unanswered conversations", () => {
  ready(); beginLegacy(); const start = JSON.parse(JSON.stringify(legacyState()));
  expect(finishCousinExchange()).toBe(false); expect(finishJournalistExchange()).toBe(false);
  expect(deliverLegacyReport()).toBe(false); expect(legacyState()).toEqual(start);
});
it("restores exact partial choices, both held documents and the earlier visit", () => {
  ready(); beginLegacy(); const before = JSON.parse(JSON.stringify(legacyState()));
  chooseCousinResponse("music"); const partial = JSON.parse(JSON.stringify(legacyState()));
  finishCousinExchange(); collectFamilyLetters(); const family = JSON.parse(JSON.stringify(legacyState()));
  deliverFamilyLetters(); chooseJournalistResponse("motive"); finishJournalistExchange(); collectLegacyReport();
  const report = JSON.parse(JSON.stringify(legacyState())); deliverLegacyReport(); finishLegacy();
  for (const checkpoint of [report, family, partial, before]) {
    legacyCheckpoint.write(checkpoint); expect(legacyState()).toEqual(checkpoint);
  }
  expect(chooseCousinResponse("witness")).toBe(true);
});
it("rejects impossible save sequences and unknown decisions", () => {
  const initial = legacyState();
  for (const patch of [{ phase: "Intended" }, { cousinResponse: "music" }, { journalistResponse: "party" },
    { phase: "familyReady" }, { phase: "journalist", cousinResponse: "wrong" },
    { phase: "cousin", journalistResponse: "party" }, { phase: "complete", cousinResponse: "music" },
    { phase: "reportReady", cousinResponse: "witness", journalistResponse: "wrong" }]) {
    storage.set("journey.kurtzLegacy", { ...initial, ...patch } as never); expect(legacyState()).toEqual(initial);
  }
});
