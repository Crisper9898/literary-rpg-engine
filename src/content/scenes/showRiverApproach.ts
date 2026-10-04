import { canvas } from "@drincs/pixi-vn";
import { Container, Graphics, type Ticker } from "pixi.js";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { journeyArtStage } from "../../story/heart-of-darkness/journeyArtStages";
import { journeyRiverLayers } from "../../story/heart-of-darkness/riverParallax";
import { approachHelm, approachRoute, helmsmanArt, fallenHelmsmanArt } from "../../story/heart-of-darkness/riverApproach";
import { createApproachEffects } from "../../story/heart-of-darkness/createApproachEffects";
import { NavigationController } from "../../puzzles/riverApproach/NavigationController";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { keyboardMovement } from "../../engine/movement/keyboardMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { approachCheckpoint, approachPosition, approachAtmosphere, approachProfile,
  atApproachHelm, setApproachHelm, helmsmanFate, seenApproachBeat } from "../state/approachState";
import { approachDecision, setJourneySpace } from "../state/woodStopState";
import { showJourneySpace } from "./journeyDeck";
import { registerApproachAudio, createApproachAudioLayers } from "../../story/heart-of-darkness/approachAudio";
import { attachApproachNarration } from "./attachApproachNarration";
import { updateRiverApproach } from "./updateRiverApproach";

export function showRiverApproach() {
  const { presentation, layers, player, deckhand, visual, marlowVisual } = createJourneyDeck();
  presentation.label = "journey-approach";
  for (const id of ["chapter-kicker", "deck-title", "deck-subtitle"]) presentation.getChildByLabel(id)!.visible = false;
  visual.setProgress(journeyArtStage(.78)); // Separate stage; no Deck state/assets changed.
  const marlowContact = player.children[1] as Graphics;
  marlowContact.clear().poly([-30, 1, -6, -2, 25, 0, 37, 7, 6, 12, -21, 8])
    .fill({ color: 0x050c0e, alpha: .58 });
  (deckhand.actor.getChildByLabel("deckhand-contact-shadow") as Graphics).clear()
    .poly([-26, 0, 18, -2, 35, 5, 24, 11, -14, 10, -33, 5]).fill({ color: 0x050c0e, alpha: .58 });
  canvas.layers.add("journey-approach", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Canal bajo niebla: E timón, A/D dirección, W/S marcha, Espacio sirena");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  const movement = attachPlayerMovement(player, ticker, surface,
    { ...marlowMovement, bounds: journeyDeck.walkableArea, position: approachHelm }, approachPosition);
  const keys = keyboardMovement(surface);
  const navigation = new NavigationController(approachRoute, approachCheckpoint.read());
  approachCheckpoint.write({ ...navigation.state });
  movement.setEnabled(!atApproachHelm() && navigation.state.interruptionMS === 0);
  const profile = approachProfile(approachDecision());
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const scenery = journeyRiverLayers.filter(layer => layer.id !== "foreground-reeds").map(layer =>
    attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.speed * .3,
      reference: { x: 960, y: 540 } }).layer);
  scenery.forEach(layer => layer.tint = 0x526367);
  const effects = createApproachEffects(layers.environment, layers.foreground);
  const helmsman = new Container({ label: "helmsman", x: 995, y: 748 });
  const helmsmanSlot = createVisualAssetSlot({ label: "helmsman-art", source: helmsmanArt, fallback: () => new Container() });
  helmsman.addChild(new Graphics().poly([-30, 1, 35, 1, 65, 13, 4, 18, -32, 6]).fill({ color: 0x03090b, alpha: .5 }), helmsmanSlot.container);
  layers.actors.addChild(helmsman);
  const fallen = createVisualAssetSlot({ label: "fallen-helmsman-art", source: fallenHelmsmanArt, fallback: () => new Container() });
  fallen.container.position.set(1120, 796); fallen.container.alpha = 0;
  layers.actors.addChild(new Graphics({ label: "fallen-contact-shadow" })
    .poly([1010, 770, 1075, 760, 1170, 766, 1240, 782, 1190, 799, 1100, 794, 1010, 783])
    .fill({ color: 0x03090b, alpha: .38 }), fallen.container);
  const wheel = new Graphics({ label: "approach-wheel", x: 990, y: 649 })
    .circle(0, 0, 34).stroke({ color: 0x181c16, width: 11 })
    .circle(0, 0, 34).stroke({ color: 0x86724e, width: 5 })
    .circle(0, 0, 8).fill(0x3e463b).stroke({ color: 0xb19665, width: 2 });
  for (let i = 0; i < 8; i++) { const angle = i * Math.PI / 4;
    wheel.moveTo(0, 0).lineTo(Math.cos(angle) * 43, Math.sin(angle) * 43).stroke({ color: 0x92805b, width: 4 }); }
  const stand = new Graphics({ label: "wheel-pedestal" }).poly([974, 663, 1002, 663, 1008, 739, 970, 739])
    .fill(0x25332e).stroke({ color: 0x65705d, width: 2 });
  layers.actors.addChild(stand, wheel);
  deckhand.actor.position.set(1230, 780);
  const status = document.createElement("p"); status.className = "approach-navigation-status";
  status.dataset.testid = "navigation-status"; status.setAttribute("aria-live", "polite"); surface.parentElement!.append(status);
  const inRange = () => Math.hypot(player.x - approachHelm.x, player.y - approachHelm.y) <= 100;
  const prompt = () => navigation.state.progress === 1 ?
    inRange() ? "E · Aproximarse a la Estación Interior" : "Acércate al timón para alcanzar la Estación Interior" :
    navigation.state.interruptionMS > 0 ? "El timonel ha caído. Recupera la rueda…" :
    atApproachHelm() ? "E · Soltar el timón · Espacio · Sirena" :
    inRange() ? "E · Tomar el timón y seguir el canal" : "Acércate a la rueda · WASD / flechas";
  const dialogue = attachApproachNarration(presentation, ticker, surface, () => interact(), prompt);
  const listeners = new AbortController();
  let leaving = false;
  async function interact() {
    if (leaving) return;
    if (dialogue.active()) { void dialogue.advance(); return; }
    if (navigation.state.progress === 1 && seenApproachBeat("after") && inRange()) {
      leaving = true;
      try { setJourneySpace("station-arrival"); await showJourneySpace(); }
      catch (error) { leaving = false; console.error("Could not reach station", error); }
      return;
    }
    if (navigation.state.interruptionMS > 0 || navigation.state.progress === 1) return;
    if (atApproachHelm() || inRange()) {
      setApproachHelm(!atApproachHelm());
      movement.setEnabled(!atApproachHelm());
    }
  }
  surface.addEventListener("keydown", event => {
    if (event.target !== surface || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code === "KeyE") { event.preventDefault(); interact(); }
    if (event.code === "Space") {
      event.preventDefault();
      if (atApproachHelm() && navigation.state.progress >= .65 && navigation.state.interruptionMS === 0) {
        navigation.soundWhistle(); approachCheckpoint.write({ ...navigation.state });
      }
    }
  }, { signal: listeners.signal });
  attachMarlowArt(player, ticker, marlowVisual.setState,
    () => navigation.state.progress >= .48 && navigation.state.progress < .93 ? "alarm" : "concern");
  const atmosphere = attachAtmosphere(presentation, ticker, {
    progress: () => navigation.state.progress, checkpoint: approachAtmosphere,
    keyframes: [{ progress: 0, values: { mist: profile.initialMist, shade: .06 } },
      { progress: .42, values: { mist: .85, shade: .22 } },
      { progress: .5, values: { mist: .55, shade: .28 } },
      { progress: .8, values: { mist: .75, shade: .28 } },
      { progress: 1, values: { mist: .23, shade: .12 } }],
    apply: state => { effects.applyMist(state.mist);
      const v = Math.round(255 * (1 - state.shade)); layers.environment.tint = (v << 16) | (v << 8) | v;
      layers.ground.tint = 0x829498; layers.actors.tint = 0xa3acac; },
  });
  registerApproachAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface,
    { namespace: "journey-approach", listener: () => ({ x: navigation.state.lateral, y: 0 }),
      layers: createApproachAudioLayers(() => navigation.state) });
  const update = (frame: Ticker) => {
    const input = keys.read();
    const s = updateRiverApproach(navigation, { helm: atApproachHelm() && !document.hidden && document.activeElement === surface,
      steer: input.x, throttle: -input.y }, frame.deltaMS);
    if (s.progress === 1 && atApproachHelm()) setApproachHelm(false);
    movement.setEnabled(!atApproachHelm() && s.interruptionMS === 0);
    for (const layer of [layers.ground, layers.actors, layers.foreground]) layer.x = s.lateral * 120;
    effects.update(s, frame.deltaMS, profile.lookAhead);
    const lost = helmsmanFate() === "lost";
    const fall = lost ? 1 - s.interruptionMS / 2400 : 0;
    helmsmanSlot.container.rotation = -Math.PI / 2 * fall;
    helmsmanSlot.container.scale.y = 1 - fall * .32;
    helmsman.y = 748 + fall * 15; helmsman.x = 995 + fall * 95;
    helmsman.alpha = 1 - fall;
    fallen.container.alpha = fall;
    layers.actors.getChildByLabel("fallen-contact-shadow")!.alpha = fall;
    wheel.rotation = s.heading * .5;
    deckhand.setMood(s.progress >= .48 && s.progress < .93 ? "alarm" : "concern");
    deckhand.pose({ mode: "idle", activity: "lookout", elapsedMS: s.progress * 60000, isMoving: false,
      position: deckhand.actor.position, facing: { x: -1, y: 0 }, stopIndex: 0, idleRemainingMS: 3000,
      velocity: { x: 0, y: 0 } }, frame.deltaMS);
    const art = player.getChildByLabel("marlow-art")!;
    if (lost && s.progress < .93) { art.rotation += .06; art.y += 3; }
    if (s.progress === 1) { art.y += 4; art.rotation += .04; }
    const next = approachRoute.obstacles.find(o => o.progress > s.progress && o.progress - s.progress < profile.lookAhead);
    const signal = s.progress >= .07 && s.progress < .22 ? "Babor · voces entre las hojas" :
      s.progress >= .25 && s.progress < .4 ? "Estribor · ramas y golpes" : "Escucha ambas orillas";
    const stage = s.progress === 1 ? "Después del ataque" : s.progress >= .65 ? "La rueda queda en tus manos" :
      s.progress >= .48 ? "Ataque desde la orilla" : "Aproximación bajo niebla";
    const text = `${stage}\n${atApproachHelm() ? "Gobiernas el vapor" : "Timón libre"} · ${s.lateral < -.2 ? "Babor" : s.lateral > .2 ? "Estribor" : "Centro del canal"}\n` +
      (s.progress >= .65 && !s.whistle ? "Espacio · Acciona la sirena para abrir el paso" :
        next ? `${approachDecision() === "proceed" ? "Sonda" : "Vigía"}: ${next.kind === "log" ? "tronco" : next.kind === "shoal" ? "banco de arena" : "vegetación"} por ${next.lateral < 0 ? "babor" : "estribor"}` : signal) +
      (s.slowMS > 0 ? "\nContacto: aminora y corrige el rumbo" : "");
    if (status.textContent !== text) status.textContent = text;
  };
  ticker.add(update, undefined, -1.5);
  const bankSteering = () => { for (const layer of scenery) layer.x -= navigation.state.lateral * 205; };
  ticker.add(bankSteering, undefined, -5);
  presentation.once("destroyed", () => { ticker.remove(update); ticker.remove(bankSteering);
    keys.dispose(); listeners.abort(); status.remove(); effects.dispose(); });
  surface.focus({ preventScroll: true });
  return { presentation, navigation, player, atmosphere, audio };
}
