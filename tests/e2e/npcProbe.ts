import { canvas, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";

let scene: ReturnType<typeof showJourneyDeck>;
let endObservation: (() => void) | undefined;
let report = { cycles: 0, frames: 0, simulatedMS: 0, simultaneousFrames: 0,
  activities: [] as string[], facings: [] as number[], violations: [] as string[] };

export function inspectInitialNpc() {
  const layer = canvas.layers.get("journey-deck");
  const world = layer?.getChildByLabel("world") as Container | undefined;
  const actor = (world?.getChildByLabel("actors") as Container | undefined)?.getChildByLabel("journey-deckhand");
  if (!actor || !layer) return null;
  const position = layer.toLocal(actor.getGlobalPosition());
  return { registered: RegisteredCharacters.has("journey-deckhand"), x: position.x, y: position.y };
}

export function startNpcScene() {
  endObservation?.();
  scene = showJourneyDeck();
}

export function inspectNpc() {
  return { npc: scene.npc.state, player: { x: scene.player.x, y: scene.player.y }, camera: scene.camera.state };
}

export function retainedNpcState() { return scene.npc.state; }

export function npcCommand(command: "pause" | "resume" | "focus" | "follow") {
  if (command === "pause") { scene.npc.pause(); scene.npc.face(scene.player.position); }
  if (command === "resume") scene.npc.resume();
  if (command === "focus") scene.camera.focus(scene.npc.cameraTarget);
  if (command === "follow") scene.camera.resumeFollow();
}

/** Observe live frames without accelerating the simulation or synthesizing actor positions. */
export function beginObservation() {
  endObservation?.();
  report = { cycles: 0, frames: 0, simulatedMS: 0, simultaneousFrames: 0, activities: [], facings: [], violations: [] };
  let previousNpc = scene.npc.state.position;
  let previousPlayer = { x: scene.player.x, y: scene.player.y };
  let lastIdle = 0;
  const sample = (frame: Ticker) => {
    const { npc, player } = inspectNpc();
    report.frames++;
    report.simulatedMS += Math.min(frame.deltaMS, 50);
    const distance = Math.hypot(npc.position.x - previousNpc.x, npc.position.y - previousNpc.y);
    if (npc.position.x < 420 || npc.position.x > 1500 || npc.position.y < 680 || npc.position.y > 840) report.violations.push("outside deck");
    if (distance > 95 * Math.min(frame.deltaMS, 50) / 1000 + 1e-5) report.violations.push("position jump");
    if (distance > 0 && Math.hypot(player.x - previousPlayer.x, player.y - previousPlayer.y) > 0) report.simultaneousFrames++;
    const facing = Math.sign(npc.facing.x);
    if (!report.facings.includes(facing)) report.facings.push(facing);
    if (npc.mode === "idle") {
      if (npc.activity && !report.activities.includes(npc.activity)) report.activities.push(npc.activity);
      if (npc.stopIndex === 0 && lastIdle !== 0) report.cycles++;
      lastIdle = npc.stopIndex;
    }
    previousNpc = npc.position;
    previousPlayer = player;
  };
  canvas.app.ticker.add(sample, undefined, UPDATE_PRIORITY.LOW);
  endObservation = () => canvas.app.ticker.remove(sample);
}

export function observationReport() { return report; }
export function finishObservation() { endObservation?.(); endObservation = undefined; return report; }
