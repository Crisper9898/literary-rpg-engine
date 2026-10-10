import { Container, Graphics } from "pixi.js";
import { createJourneyDeck } from "./createJourneyDeck";
import { journeyArtStage } from "./journeyArtStages";
import { kurtzArt } from "./kurtzIntroduction";
import { stationEvidence } from "./stationRevelations";
import { breakdownPoints } from "./kurtzBreakdown";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";

/** Episode-local staging. The approved Deck factory, plates and character atlases are read-only. */
export function createKurtzBreakdown() {
  const scene = createJourneyDeck(), { presentation, layers, player } = scene;
  presentation.label = "journey-inner-station"; player.label = "breakdown-player";
  for (const id of ["chapter-kicker", "deck-title", "deck-subtitle"]) presentation.getChildByLabel(id)!.visible = false;
  scene.visual.setProgress(journeyArtStage(.48));
  const patient = new Container({ label: "breakdown-kurtz", x: 650, y: 730 });
  patient.addChild(new Graphics().poly([-70, 0, 65, 0, 170, 55, 40, 65]).fill({ color: 0x031010, alpha: .25 })
    .ellipse(0, 5, 125, 11).fill({ color: 0x031010, alpha: .68 }));
  const patientArt = createVisualAssetSlot({ label: "breakdown-kurtz-art", source: kurtzArt, fallback: () => new Container() });
  patientArt.container.scale.set(.82); patientArt.container.tint = 0xa3b8aa; patientArt.setState("weak");
  patient.addChild(patientArt.container); layers.actors.addChild(patient);
  const papers = new Container({ label: "breakdown-papers", x: 735, y: 730 });
  papers.addChild(new Graphics().ellipse(0, 2, 28, 5).fill({ color: 0x031010, alpha: .6 }));
  const papersArt = createVisualAssetSlot({ label: "breakdown-papers-art", source: stationEvidence.report.art, fallback: () => new Container() });
  papersArt.container.scale.set(.36); papersArt.container.tint = 0xbaad88; papers.addChild(papersArt.container); layers.actors.addChild(papers);
  const engine = new Container({ label: "breakdown-engine", ...breakdownPoints.engine });
  // A low, perspective-matched service hatch; the cylinders remain below deck.
  const hatch = new Graphics().ellipse(0, 7, 72, 9).fill({ color: 0x04100f, alpha: .5 })
    .poly([-64, -14, 46, -23, 65, 6, -48, 16]).fill(0x302e20).stroke({ color: 0x0e1915, width: 3 })
    .poly([-53, -10, 41, -17, 53, 2, -42, 10]).fill(0x061310)
    .moveTo(-62, -13).lineTo(45, -21).stroke({ color: 0xa0804b, width: 2, alpha: .65 })
    .moveTo(-48, 15).lineTo(64, 5).stroke({ color: 0x7f6842, width: 2, alpha: .65 })
    .ellipse(-18, -2, 19, 6).fill(0x2a332b).stroke({ color: 0x696449, width: 2 })
    .moveTo(5, -5).lineTo(31, -7).stroke({ color: 0x696449, width: 4 });
  for (let i = 0; i < 8; i++) hatch.moveTo(-42 + i * 12, 11 - i * .7).lineTo(-36 + i * 12, 10 - i * .7)
    .stroke({ color: i % 2 ? 0x857043 : 0x141f17, width: 1, alpha: .7 });
  engine.addChild(hatch);
  const rod = new Graphics({ label: "breakdown-rod" }).moveTo(-42, 4).lineTo(-4, -7).lineTo(40, -2)
    .stroke({ color: 0x091512, width: 8 }).moveTo(-42, 3).lineTo(-4, -8).lineTo(40, -3)
    .stroke({ color: 0x8c8059, width: 3 }).circle(-42, 3, 5).circle(40, -3, 5)
    .stroke({ color: 0x766d4b, width: 3 }); engine.addChild(rod); layers.actors.addChild(engine);
  const forge = new Container({ label: "breakdown-forge", ...breakdownPoints.forge });
  const glow = new Graphics({ label: "breakdown-forge-glow" }).ellipse(0, 4, 85, 22).fill({ color: 0xc36d28, alpha: .09 })
    .ellipse(0, 1, 52, 14).fill({ color: 0xd58b36, alpha: .13 });
  forge.addChild(glow, new Graphics().ellipse(0, 5, 56, 8).fill({ color: 0x050e0d, alpha: .7 })
    .poly([-32, -13, -39, 0, -29, 3, -20, -13]).fill(0x101917)
    .poly([25, -13, 32, 2, 41, 0, 35, -16]).fill(0x101917)
    .poly([-48, -38, 48, -38, 37, -15, -31, -13]).fill(0x26302a).stroke({ color: 0x0c1714, width: 4 })
    .ellipse(0, -38, 48, 13).fill(0x0e1815).stroke({ color: 0x8a7b55, width: 3 })
    .poly([-38, -36, -25, -44, -12, -39, 3, -46, 17, -38, 34, -42, 38, -31, 9, -28, -20, -28]).fill(0x4c3021)
    .moveTo(-34, -33).lineTo(29, -34).stroke({ color: 0xc77636, width: 3 })
    .circle(-16, -36, 3).circle(7, -39, 3).circle(25, -34, 2).fill(0xe8a454)
    .moveTo(-53, -53).lineTo(45, -49).stroke({ color: 0x091411, width: 8 })
    .moveTo(-53, -54).lineTo(45, -50).stroke({ color: 0x8f7d59, width: 4 }));
  layers.actors.addChild(forge);
  return { ...scene, patient, patientArt, papers, papersArt, engine, rod, forge, glow };
}
