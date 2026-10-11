import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { aftermathCheckpoint } from "../src/content/state/kurtzAftermathState";
import { europeCheckpoint, europeState, europePosition, beginEurope, observeStreet, openPacket,
  readReport, readLetters, prepareReport, chooseCompanyResponse, finishCompanyExchange,
  collectReport, offerReport, finishEurope } from "../src/content/state/europeReturnState";

afterEach(() => ["kurtzAftermath", "europeReturn", "europePosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => aftermathCheckpoint.write({ phase: "survived", distance: 450, progress: .78,
  papersSecured: true, response: "help", careSeen: true, waterReceived: true });
const prepared = () => { ready(); beginEurope(); openPacket(); readReport(); readLetters(); prepareReport(); };

it("enters only after recovery and preserves a single European return", () => {
  expect(beginEurope()).toBe(false); ready();
  aftermathCheckpoint.write({ ...aftermathCheckpoint.read()!, phase: "recovering" });
  expect(beginEurope()).toBe(false); ready(); expect(beginEurope()).toBe(true);
  expect(europeState().phase).toBe("returned"); expect(beginEurope()).toBe(false);
});
it("requires examining both kinds of papers before removing the postscript", () => {
  expect(readReport()).toBe(false); ready(); beginEurope();
  expect(prepareReport()).toBe(false); expect(readLetters()).toBe(false);
  expect(openPacket()).toBe(true); expect(openPacket()).toBe(false);
  expect(readLetters()).toBe(true); expect(prepareReport()).toBe(false);
  expect(readReport()).toBe(true); expect(readReport()).toBe(false);
  expect(prepareReport()).toBe(true); expect(europeState().phase).toBe("prepared");
  expect(prepareReport()).toBe(false);
});
it.each(["private", "commerce"] as const)("%s protects private letters and requires physically collecting the prepared report", response => {
  prepared(); expect(collectReport()).toBe(false); expect(offerReport()).toBe(false);
  expect(chooseCompanyResponse(response)).toBe(true);
  expect(chooseCompanyResponse(response === "private" ? "commerce" : "private")).toBe(false);
  expect(collectReport()).toBe(false); finishCompanyExchange(); expect(collectReport()).toBe(true);
  expect(finishEurope()).toBe(false); expect(offerReport()).toBe(true); expect(offerReport()).toBe(false);
  expect(finishEurope()).toBe(true); expect(europeState().phase).toBe("resolved");
  expect(europeState().response).toBe(response); expect(europeState().lettersRead).toBe(true);
  expect(collectReport()).toBe(false); expect(finishEurope()).toBe(false);
});
it("cannot finish an unanswered exchange and restores a selected but unclosed reply", () => {
  prepared(); finishCompanyExchange(); expect(europeState().exchangeSeen).toBe(false);
  chooseCompanyResponse("private"); const partial = JSON.parse(JSON.stringify(europeState()));
  finishCompanyExchange(); collectReport(); offerReport(); finishEurope();
  europeCheckpoint.write(partial); expect(europeState()).toEqual(partial);
  expect(collectReport()).toBe(false); expect(chooseCompanyResponse("commerce")).toBe(false);
  finishCompanyExchange(); expect(collectReport()).toBe(true);
});
it("keeps street observation optional and restores the earlier unexamined packet", () => {
  expect(observeStreet()).toBe(false); ready(); beginEurope();
  const returned = JSON.parse(JSON.stringify(europeState())); expect(observeStreet()).toBe(true);
  expect(observeStreet()).toBe(false); openPacket(); readReport(); readLetters(); prepareReport();
  europeCheckpoint.write(returned); expect(europeState()).toEqual(returned);
  expect(europeState().streetObserved).toBe(false); expect(openPacket()).toBe(true);
});
it("rejects impossible saved sequences instead of skipping the document dispute", () => {
  const initial = europeState();
  for (const patch of [{ phase: "Intended" }, { reportRead: true }, { streetObserved: true },
    { response: "surrender" }, { exchangeSeen: true }, { phase: "carrying" }]) {
    storage.set("journey.europeReturn", { ...initial, ...patch } as never); expect(europeState()).toEqual(initial);
  }
  prepared(); const s = europeState();
  for (const patch of [{ phase: "resolved" }, { phase: "carrying" }, { reportRead: false },
    { exchangeSeen: true }, { response: "private" }]) {
    storage.set("journey.europeReturn", { ...s, ...patch } as never); expect(europeState()).toEqual(initial);
  }
});
it("round-trips bounded actual coordinates and rejects nonfinite/outside positions", () => {
  europePosition.write({ x: 780, y: 805 }); expect(europePosition.read()).toEqual({ x: 780, y: 805 });
  for (const p of [{ x: NaN, y: 805 }, { x: 1800, y: 805 }, { x: 780, y: 640 }]) {
    storage.set("journey.europePosition", p); expect(europePosition.read()).toBeUndefined();
  }
});
