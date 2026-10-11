import { canvas, sound } from "@drincs/pixi-vn";
import { beginEurope, observeStreet, openPacket, readReport, readLetters, prepareReport,
  chooseCompanyResponse, finishCompanyExchange, collectReport, offerReport, finishEurope,
  europePosition } from "../../src/content/state/europeReturnState";
import { legacyState } from "../../src/content/state/kurtzLegacyState";
import { legacyPoints } from "../../src/story/heart-of-darkness/createKurtzLegacy";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { inspect as inspectEurope, save as saveEurope, restore as restoreEurope } from "./europeProbe";
export { settleFrame, restart } from "./stationProbe";

/** Shorten only the prior, validated Company episode. No legacy event is seeded. */
export async function prepareCompany() {
  if (!beginEurope()) throw new Error("Completed aftermath required");
  openPacket(); readReport(); readLetters(); prepareReport();
  europePosition.write({ ...legacyPoints.door }); await showJourneySpace(); return inspect();
}
export async function finishCompany(response = "private") {
  if (response === "private") observeStreet();
  chooseCompanyResponse(response === "commerce" ? "commerce" : "private"); finishCompanyExchange();
  collectReport(); offerReport(); finishEurope(); await showJourneySpace(); return inspect();
}
export async function completeEurope(response = "private") { await prepareCompany(); return finishCompany(response); }
export function inspect() {
  const base = inspectEurope(), world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const ground = world?.getChildByLabel("ground");
  return { ...base, europe: base.state, state: legacyState(),
    familyVisible: ground?.getChildByLabel("legacy-family-letters")?.visible,
    familyCount: ground?.children.filter(c => c.label === "legacy-family-letters").length ?? 0,
    lettersVisible: ground?.getChildByLabel("europe-letters")?.visible,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-legacy:") || c.alias.startsWith("journey-europe-return:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof legacyPoints) {
  const point = legacyPoints[id]; if (!point) throw new Error(`Unknown point ${id}`);
  europePosition.write({ ...point });
}
export async function save() { return { ...(await saveEurope()), ...inspect() }; }
export async function restore(data: string) { const exact = await restoreEurope(data); return { ...inspect(), player: exact.player }; }
