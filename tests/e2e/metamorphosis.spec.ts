import { expect, test, type Page } from "@playwright/test";

const useProbe = <T>(page: Page, method: string, value?: unknown) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/metamorphosisProbe.ts";
  const probe = await import(url);
  return (probe as Record<string, (...args: unknown[]) => T>)[method](...(value === undefined ? [] : [value]));
}, { method, value });
const place = (page: Page, x: number, y = 700) => page.evaluate(async ({ x, y }) => {
  const url = "/tests/e2e/metamorphosisProbe.ts";
  (await import(url)).placeGregor(x, y);
}, { x, y });
const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/metamorphosisProbe.ts";
  return (await import(url)).inspectRoom();
});
const finishFamilyIntro = async (page: Page, key: "1" | "2" = "1") => {
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
  await page.keyboard.press(key);
  await expect(page.getByTestId("metamorphosis-line")).toContainText(key === "1" ? "Estoy bien" : "no decir nada");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText(key === "1" ? "no ha entendido" : "Sigue llamándote");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("oficina");
};
const finishClerkIntro = async (page: Page, key: "1" | "2" = "1") => {
  await expect(page.getByTestId("metamorphosis-line")).toContainText("oficina");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Representante de la oficina");
  await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
  await page.keyboard.press(key);
  await expect(page.getByTestId("metamorphosis-line")).toContainText(key === "1" ? "No pude ir" : "No puedo responderle");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText(key === "1" ? "voz suena extraña" : "su silencio");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
};
const enterHallway = async (page: Page, family: "1" | "2" = "1", clerk: "1" | "2" = "1",
  grete?: "1" | "2") => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await finishFamilyIntro(page, family);
  await finishClerkIntro(page, clerk);
  if (grete) {
    await place(page, 1290, 650);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
    await page.keyboard.press(grete);
    await page.keyboard.press("e");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    await place(page, 1480, 650);
  }
  await page.keyboard.press("e");
  await expect.poll(() => useProbe<string>(page, "currentSpaceLayer")).toBe("hallway");
};

test("both works have accessible entries and the Journey remains the default", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Marlow/);
  await expect(page.getByRole("link", { name: "Heart of Darkness" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "La metamorfosis" }).click();
  await expect(page).toHaveURL(/story=metamorphosis/);
  await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Gregor/);
  await page.setViewportSize({ width: 800, height: 600 });
  await page.screenshot({ path: testInfo.outputPath("metamorphosis-room-800x600.png") });
  await page.getByRole("link", { name: "Heart of Darkness" }).click();
  await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Marlow/);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Gregor moves, interacts with window and door, and restores position, flags and audio", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  const canvas = page.locator("canvas");
  await canvas.click({ position: { x: 80, y: 80 } });
  await expect.poll(async () => (await inspect(page)).audioContextState).toBe("running");
  const first = await inspect(page);
  expect(first.position).toEqual({ x: 960, y: 730 });
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page)).position.x).toBeGreaterThan(1000);
  await expect.poll(async () => (await inspect(page)).camera.x).toBeGreaterThan(960);
  await page.keyboard.up("d");
  await place(page, 440, 630);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("ventana");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("calle");
  expect((await inspect(page)).windowSeen).toBe(true);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("lluvia");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  const atWindow = await inspect(page);
  expect(atWindow.layers.outside.target).toBeGreaterThan(atWindow.layers.voices.target);
  expect(atWindow.layers.outside.active).toBe(true);
  const saved = await useProbe<string>(page, "saveRoom");
  await place(page, 1480, 650);
  await finishFamilyIntro(page);
  await finishClerkIntro(page);
  await place(page, 1290, 650);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("Grete");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("lluvia");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
  expect((await inspect(page)).doorHeard).toBe(true);
  const atDoor = await inspect(page);
  expect(atDoor.layers.voices.target).toBeGreaterThan(atDoor.layers.outside.target);
  expect(atDoor.layers.voices.active).toBe(true);
  const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
  expect(restored.position).toEqual({ x: 440, y: 630 });
  expect(restored.windowSeen).toBe(true);
  expect(restored.doorHeard).toBe(false);
  expect(restored.layers.outside.target).toBeGreaterThan(restored.layers.voices.target);
  await expect.poll(async () => (await inspect(page)).layers.outside.mediaCount).toBe(1);
  await expect.poll(async () => (await inspect(page)).layers.room.mediaCount).toBe(1);
  await place(page, 1480, 650);
  await canvas.focus();
  await finishFamilyIntro(page);
  await finishClerkIntro(page);
  await place(page, 1290, 650);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("lluvia");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("door dialogue keeps its original line when Gregor ignores the window", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await finishFamilyIntro(page);
  await finishClerkIntro(page);
  await place(page, 1290, 650);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("hermana");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
  expect((await inspect(page)).windowSeen).toBe(false);
});

test("approaching the door reveals family activity only once before a response", async ({ page }, testInfo) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await place(page, 960, 730);
  await place(page, 1480, 650);
  await page.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
  await page.setViewportSize({ width: 800, height: 600 });
  await page.screenshot({ path: testInfo.outputPath("family-choices-800x600.png") });
});

test("the office visitor arrives only after the family exchange near the door", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  expect((await inspect(page)).clerkArrivalHeard).toBe(false);
  await finishFamilyIntro(page);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("oficina");
  expect((await inspect(page)).clerkArrivalHeard).toBe(true);
});

test("a save before the office arrival restores the pending spatial event", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  await page.keyboard.press("e");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
  await page.keyboard.press("1");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("Estoy bien");
  await place(page, 960, 730);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("no ha entendido");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  expect((await inspect(page)).clerkArrivalHeard).toBe(false);
  const saved = await useProbe<string>(page, "saveRoom");
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("oficina");
  const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
  expect(restored.position).toEqual({ x: 960, y: 730 });
  expect(restored.clerkArrivalHeard).toBe(false);
  expect(restored.familyResponse).toBe("answered");
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("oficina");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("a save after the arrival does not replay it when restored beside the door", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  const canvas = page.locator("canvas");
  await canvas.click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await finishFamilyIntro(page);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  expect((await inspect(page)).clerkArrivalHeard).toBe(true);
  const saved = await useProbe<string>(page, "saveRoom");
  await place(page, 960, 730);
  await place(page, 1480, 650);
  await page.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
  expect(restored.position).toEqual({ x: 1480, y: 650 });
  expect(restored.clerkArrivalHeard).toBe(true);
  await canvas.focus();
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("Madre oyó tu voz");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("the door opens to a hallway only after Gregor answers the office representative", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
  await finishFamilyIntro(page);
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
  await finishClerkIntro(page);
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
  await page.keyboard.press("e");
  await expect.poll(() => useProbe<string>(page, "currentSpaceLayer")).toBe("hallway");
});

test("a room save before the conversations keeps the exit locked", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  const saved = await useProbe<string>(page, "saveRoom");
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  const restored = await useProbe<{
    space: string; position: { x: number; y: number }; familyResponse?: string; clerkResponse?: string;
  }>(page, "restoreSpace", saved);
  expect(restored.space).toBe("room");
  expect(restored.position).toEqual({ x: 960, y: 730 });
  expect(restored.familyResponse).toBeUndefined();
  expect(restored.clerkResponse).toBeUndefined();
  await place(page, 1480, 650);
  await expect(page.getByTestId("metamorphosis-line")).toContainText("pasos");
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
});

test("hallway movement, observation and both return paths survive save/restore", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.goto("/?story=metamorphosis");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await useProbe(page, "mountRoom");
  const canvas = page.locator("canvas");
  await canvas.click({ position: { x: 80, y: 80 } });
  await place(page, 1480, 650);
  await finishFamilyIntro(page, "2");
  await finishClerkIntro(page, "1");
  const beforeExit = await useProbe<string>(page, "saveRoom");
  await page.keyboard.press("e");
  const entered = await useProbe<{
    space: string; position: { x: number; y: number }; familyResponse: string; clerkResponse: string;
    audio: { room: number; hallway: number };
  }>(page, "inspectSpace");
  expect(entered.space).toBe("hallway");
  expect(entered.position).toEqual({ x: 560, y: 700 });
  expect(entered.familyResponse).toBe("silent");
  expect(entered.clerkResponse).toBe("explain");
  expect(entered.audio.room).toBe(0);
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await page.setViewportSize({ width: 800, height: 600 });
  await page.screenshot({ path: testInfo.outputPath("metamorphosis-hallway-800x600.png") });
  await canvas.focus();
  await page.keyboard.down("d");
  await expect.poll(async () => (await useProbe<typeof entered>(page, "inspectSpace")).position.x)
    .toBeGreaterThan(600);
  await page.keyboard.up("d");
  await place(page, 1280, 650);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("cuadro");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("cuadro del pasillo");
  await page.screenshot({ path: testInfo.outputPath("metamorphosis-hallway-dialogue-800x600.png") });
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  const hallSaved = await useProbe<string>(page, "saveRoom");
  await place(page, 1500, 700);
  const hallRestored = await useProbe<typeof entered>(page, "restoreSpace", hallSaved);
  expect(hallRestored.space).toBe("hallway");
  expect(hallRestored.position).toEqual({ x: 1280, y: 650 });
  expect(hallRestored.familyResponse).toBe("silent");
  expect(hallRestored.clerkResponse).toBe("explain");
  await expect.poll(async () => (await useProbe<typeof entered>(page, "inspectSpace")).audio.hallway)
    .toBeGreaterThan(0);
  await place(page, 370, 680);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("Volver");
  await page.keyboard.press("e");
  const returned = await useProbe<typeof entered>(page, "inspectSpace");
  expect(returned.space).toBe("room");
  expect(returned.position).toEqual({ x: 1220, y: 700 });
  expect(returned.audio.hallway).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("metamorphosis-return-800x600.png") });
  const roomSaved = await useProbe<string>(page, "saveRoom");
  await place(page, 1480, 650);
  await page.keyboard.press("e");
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("hallway");
  const roomRestored = await useProbe<typeof entered>(page, "restoreSpace", roomSaved);
  expect(roomRestored.space).toBe("room");
  expect(roomRestored.position).toEqual({ x: 1220, y: 700 });
  expect(roomRestored.familyResponse).toBe("silent");
  expect(roomRestored.clerkResponse).toBe("explain");
  await place(page, 1480, 650);
  await page.keyboard.press("e");
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("hallway");
  const beforeExitRestored = await useProbe<typeof entered>(page, "restoreSpace", beforeExit);
  expect(beforeExitRestored.space).toBe("room");
  expect(beforeExitRestored.position).toEqual({ x: 1480, y: 650 });
  await page.keyboard.press("e");
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("hallway");
  expect(await page.locator("[aria-label='Interacciones del pasillo']").count()).toBe(1);
  expect(await page.locator("[aria-label='Interacciones de la habitación']").count()).toBe(0);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Grete and the office representative are visible, react once, and retain reactions after restore", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await enterHallway(page);
  const initial = await useProbe<{
    grete: { x: number; y: number; facing: number } | null;
    clerk: { x: number; y: number; facing: number } | null;
    greteSawGregor: boolean; clerkSawGregor: boolean;
  }>(page, "inspectHallwayNpcs");
  expect(initial.grete).not.toBeNull();
  expect(initial.clerk).not.toBeNull();
  expect(initial.greteSawGregor).toBe(false);
  expect(initial.clerkSawGregor).toBe(false);
  await page.setViewportSize({ width: 800, height: 600 });
  await page.screenshot({ path: testInfo.outputPath("hallway-both-npcs-800x600.png") });
  const beforeGrete = await useProbe<string>(page, "saveRoom");
  await place(page, 650, 700);
  await expect.poll(async () => (await useProbe<typeof initial>(page, "inspectHallwayNpcs")).greteSawGregor).toBe(true);
  const reactedGrete = await useProbe<typeof initial>(page, "inspectHallwayNpcs");
  expect(reactedGrete.grete!.x).toBeGreaterThan(initial.grete!.x);
  await place(page, 560, 700);
  await place(page, 650, 700);
  expect((await useProbe<typeof initial>(page, "inspectHallwayNpcs")).grete!.x)
    .toBe(reactedGrete.grete!.x);
  await place(page, 560, 700);
  await useProbe(page, "restoreSpace", beforeGrete);
  const restoredBefore = await useProbe<typeof initial>(page, "inspectHallwayNpcs");
  expect(restoredBefore.greteSawGregor).toBe(false);
  expect((await useProbe<typeof initial>(page, "inspectHallwayNpcs")).grete!.x).toBe(initial.grete!.x);
  await place(page, 650, 700);
  await expect.poll(async () => (await useProbe<typeof initial>(page, "inspectHallwayNpcs")).greteSawGregor).toBe(true);
  const afterGrete = await useProbe<string>(page, "saveRoom");
  await place(page, 560, 700);
  await useProbe(page, "restoreSpace", afterGrete);
  const restoredGrete = await useProbe<typeof initial>(page, "inspectHallwayNpcs");
  expect(restoredGrete.greteSawGregor).toBe(true);
  expect(restoredGrete.grete!.x).toBe(reactedGrete.grete!.x);
  await place(page, 980, 700);
  await expect.poll(async () => (await useProbe<typeof initial>(page, "inspectHallwayNpcs")).clerkSawGregor).toBe(true);
  const reactedClerk = await useProbe<typeof initial>(page, "inspectHallwayNpcs");
  expect(reactedClerk.clerk!.x).toBeGreaterThan(initial.clerk!.x);
  await place(page, 560, 700);
  await place(page, 980, 700);
  expect((await useProbe<typeof initial>(page, "inspectHallwayNpcs")).clerk!.x)
    .toBe(reactedClerk.clerk!.x);
  const afterClerk = await useProbe<string>(page, "saveRoom");
  await place(page, 560, 700);
  await useProbe(page, "restoreSpace", afterClerk);
  const restoredClerk = await useProbe<typeof initial>(page, "inspectHallwayNpcs");
  expect(restoredClerk.clerkSawGregor).toBe(true);
  expect(restoredClerk.clerk!.x).toBe(reactedClerk.clerk!.x);
  expect(restoredClerk.greteSawGregor).toBe(true);
});

test("the office representative walks to the exit and stays gone across every save phase", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await enterHallway(page);
  await page.setViewportSize({ width: 800, height: 600 });
  await place(page, 1010, 700);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("representante");
  const inspectNpc = () => useProbe<{
    clerk: { x: number; y: number } | null; clerkLeaving: boolean; clerkLeft: boolean;
  }>(page, "inspectHallwayNpcs");
  const initially = await inspectNpc();
  expect(initially.clerk).not.toBeNull();
  expect(initially.clerkLeaving).toBe(false);
  expect(initially.clerkLeft).toBe(false);
  await page.screenshot({ path: testInfo.outputPath("clerk-before-departure-800x600.png") });
  const beforeTalk = await useProbe<string>(page, "saveRoom");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("Dijo que estaba enfermo");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("informar a la oficina");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await expect.poll(async () => (await inspectNpc()).clerkLeaving).toBe(true);
  expect((await inspectNpc()).clerkLeft).toBe(false);
  const startingX = (await inspectNpc()).clerk!.x;
  await page.screenshot({ path: testInfo.outputPath("clerk-departure-start-800x600.png") });
  await page.keyboard.down("a");
  await expect.poll(async () => (await useProbe<{ position: { x: number } }>(page, "inspectSpace")).position.x)
    .toBeLessThan(985);
  await page.keyboard.up("a");
  await expect.poll(async () => (await inspectNpc()).clerk?.x ?? 0).toBeGreaterThan(startingX + 55);
  await page.screenshot({ path: testInfo.outputPath("clerk-departure-progress-800x600.png") });
  await expect(page.getByTestId("metamorphosis-prompt")).not.toContainText("representante");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
  await expect.poll(async () => (await inspectNpc()).clerkLeft, { timeout: 15_000 }).toBe(true);
  expect((await inspectNpc()).clerk).toBeNull();
  await page.screenshot({ path: testInfo.outputPath("clerk-departure-complete-800x600.png") });
  const afterDeparture = await useProbe<string>(page, "saveRoom");
  await place(page, 700, 700);
  await expect(page.getByTestId("metamorphosis-prompt")).toContainText("Grete");
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
  await page.keyboard.press("e");
  await page.keyboard.press("e");

  await useProbe(page, "restoreSpace", beforeTalk);
  expect((await inspectNpc()).clerk).not.toBeNull();
  expect((await inspectNpc()).clerkLeaving).toBe(false);
  await place(page, 1010, 700);
  await page.keyboard.press("e");
  await expect(page.getByTestId("metamorphosis-line")).toContainText("Dijo que estaba enfermo");
  await page.keyboard.press("e");
  await page.keyboard.press("e");
  await expect.poll(async () => (await inspectNpc()).clerkLeaving).toBe(true);
  expect((await inspectNpc()).clerkLeft).toBe(false);
  const duringDeparture = await useProbe<string>(page, "saveRoom");
  await useProbe(page, "restoreSpace", duringDeparture);
  expect((await inspectNpc()).clerkLeft).toBe(true);
  expect((await inspectNpc()).clerk).toBeNull();
  await useProbe(page, "restoreSpace", afterDeparture);
  expect((await inspectNpc()).clerkLeft).toBe(true);
  expect((await inspectNpc()).clerk).toBeNull();
  await place(page, 370, 680);
  await page.keyboard.press("e");
  expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

for (const path of [
  { family: "1", clerk: "1", grete: "1", greteLine: "Te oí responder",
    greteMemory: "Dije que me quedaría", clerkLine: "Dijo que estaba enfermo",
    otherFamily: "silent", otherClerk: "silent" },
  { family: "2", clerk: "2", grete: "2", greteLine: "No dijiste nada",
    greteMemory: "Pediste que me fuera", clerkLine: "Guardó silencio",
    otherFamily: "answered", otherClerk: "explain" },
] as const) {
  test(`hallway NPC dialogue reflects the ${path.family === "1" ? "answered" : "silent"} path after restore`,
    async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await enterHallway(page, path.family, path.clerk, path.grete);
      await page.setViewportSize({ width: 800, height: 600 });
      await place(page, 700, 700);
      await expect(page.getByTestId("metamorphosis-prompt")).toContainText("Grete");
      await page.screenshot({ path: testInfo.outputPath(`hallway-grete-prompt-${path.family}-800x600.png`) });
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
      await expect(page.getByTestId("metamorphosis-line")).toContainText(path.greteLine);
      await page.screenshot({ path: testInfo.outputPath(`hallway-grete-dialogue-${path.family}-800x600.png`) });
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-line")).toContainText(path.greteMemory);
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
      await place(page, 1010, 700);
      await expect(page.getByTestId("metamorphosis-prompt")).toContainText("representante");
      await page.screenshot({ path: testInfo.outputPath(`hallway-clerk-prompt-${path.clerk}-800x600.png`) });
      const saved = await useProbe<string>(page, "saveRoom");
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Representante de la oficina");
      await expect(page.getByTestId("metamorphosis-line")).toContainText(path.clerkLine);
      await page.screenshot({ path: testInfo.outputPath(`hallway-clerk-dialogue-${path.clerk}-800x600.png`) });
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-line")).toContainText("informar a la oficina");
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
      await useProbe(page, "changeFamilyResponse", path.otherFamily);
      await useProbe(page, "changeClerkResponse", path.otherClerk);
      await useProbe(page, "restoreSpace", saved);
      await place(page, 700, 700);
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-line")).toContainText(path.greteLine);
      await page.keyboard.press("e");
      await page.keyboard.press("e");
      await place(page, 1010, 700);
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-line")).toContainText(path.clerkLine);
      await page.keyboard.press("e");
      await page.keyboard.press("e");
      await place(page, 370, 680);
      await page.keyboard.press("e");
      expect(await useProbe<string>(page, "currentSpaceLayer")).toBe("room");
      expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
    });
}

for (const path of [
  { familyKey: "1", family: "answered", clerkKey: "1", response: "explain",
    grete: "Madre oyó tu voz", outcome: "voz suena extraña", other: "silent" },
  { familyKey: "2", family: "silent", clerkKey: "2", response: "silent",
    grete: "Como no respondiste", outcome: "su silencio", other: "explain" },
] as const) {
  test(`office ${path.response} choice responds differently and survives save/restore`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.goto("/?story=metamorphosis");
    await expect.poll(() => page.locator("canvas").count()).toBe(1);
    await useProbe(page, "mountRoom");
    const canvas = page.locator("canvas");
    await canvas.click({ position: { x: 80, y: 80 } });
    await place(page, 1480, 650);
    await finishFamilyIntro(page, path.familyKey);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.grete);
    expect((await inspect(page)).familyResponse).toBe(path.family);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Representante de la oficina");
    await expect(page.getByTestId("metamorphosis-line")).toContainText("no acudió al trabajo");
    await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
    await page.setViewportSize({ width: 800, height: 600 });
    await page.screenshot({ path: testInfo.outputPath(`office-choices-${path.response}-800x600.png`) });
    await page.keyboard.press(path.clerkKey);
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.response === "explain" ?
      "No pude ir" : "No puedo responderle");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.outcome);
    expect((await inspect(page)).clerkResponse).toBe(path.response);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    const saved = await useProbe<string>(page, "saveRoom");
    await useProbe(page, "changeClerkResponse", path.other);
    expect((await inspect(page)).clerkResponse).toBe(path.other);
    const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
    expect(restored.clerkArrivalHeard).toBe(true);
    expect(restored.clerkResponse).toBe(path.response);
    await place(page, 1290, 650);
    await canvas.focus();
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.family === "answered" ?
      "Madre sigue inquieta" : "Madre ha vuelto a preguntar");
    await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
    expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  });
}

for (const path of [
  { key: "1", saved: "answered", other: "silent", consequence: "Madre sigue inquieta" },
  { key: "2", saved: "silent", other: "answered", consequence: "Madre ha vuelto a preguntar" },
] as const) {
  test(`family ${path.saved} decision changes later dialogue and survives save/restore`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.goto("/?story=metamorphosis");
    await expect.poll(() => page.locator("canvas").count()).toBe(1);
    await useProbe(page, "mountRoom");
    const canvas = page.locator("canvas");
    await canvas.click({ position: { x: 80, y: 80 } });
    await place(page, 1480, 650);
    await finishFamilyIntro(page, path.key);
    expect((await inspect(page)).familyActivityHeard).toBe(true);
    expect((await inspect(page)).familyResponse).toBe(path.saved);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    const saved = await useProbe<string>(page, "saveRoom");
    await useProbe(page, "changeFamilyResponse", path.other);
    expect((await inspect(page)).familyResponse).toBe(path.other);
    const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
    expect(restored.familyActivityHeard).toBe(true);
    expect(restored.familyResponse).toBe(path.saved);
    await canvas.focus();
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.saved === "answered" ?
      "Madre oyó tu voz" : "Como no respondiste");
    if (path.saved === "answered") {
      await page.setViewportSize({ width: 800, height: 600 });
      await page.keyboard.press("e");
      await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
      await page.screenshot({ path: testInfo.outputPath("clerk-after-family-800x600.png") });
    } else await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
    await page.keyboard.press("1");
    await expect(page.getByTestId("metamorphosis-line")).toContainText("No pude ir");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText("voz suena extraña");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    await place(page, 1290, 650);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.consequence);
    expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  });
}

for (const path of [
  { key: "1", saved: "stay", other: "2", gregor: "Quédate", grete: "Me quedaré", returnLine: "Sigo aquí" },
  { key: "2", saved: "leave", other: "1", gregor: "Déjame solo", grete: "De acuerdo", returnLine: "He vuelto" },
] as const) {
  test(`Grete's ${path.saved} response changes later dialogue and survives save/restore`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.goto("/?story=metamorphosis");
    await expect.poll(() => page.locator("canvas").count()).toBe(1);
    await useProbe(page, "mountRoom");
    const canvas = page.locator("canvas");
    await canvas.click({ position: { x: 80, y: 80 } });
    await place(page, 1480, 650);
    await finishFamilyIntro(page);
    await finishClerkIntro(page);
    await place(page, 1290, 650);
    await expect(page.getByTestId("metamorphosis-prompt")).toContainText("Grete");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
    if (path.saved === "stay") {
      await page.setViewportSize({ width: 800, height: 600 });
      await page.screenshot({ path: testInfo.outputPath("grete-choices-800x600.png") });
    }
    await page.keyboard.press(path.key);
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.gregor);
    expect((await inspect(page)).greteResponse).toBe(path.saved);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.grete);
    await expect(page.getByTestId("metamorphosis-speaker")).toHaveText("Grete Samsa");
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-dialogue")).toBeHidden();
    const saved = await useProbe<string>(page, "saveRoom");

    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.returnLine);
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-choice")).toHaveCount(2);
    await page.keyboard.press(path.other);
    await expect.poll(async () => (await inspect(page)).greteResponse).not.toBe(path.saved);
    const restored = await useProbe<ReturnType<typeof inspect>>(page, "restoreRoom", saved);
    expect(restored.greteResponse).toBe(path.saved);
    await canvas.focus();
    await page.keyboard.press("e");
    await expect(page.getByTestId("metamorphosis-line")).toContainText(path.returnLine);
    expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  });
}

test("all three Metamorphosis cues decode as distinct non-silent audio", async ({ page }) => {
  await page.goto("/?story=metamorphosis");
  const levels = await page.evaluate(async () => {
    const context = new AudioContext();
    try {
      return await Promise.all(["room", "outside", "voices"].map(async name => {
        const response = await fetch(`/assets/audio/metamorphosis/${name}.wav`);
        if (!response.ok) throw new Error(`Missing ${name} cue`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        const samples = buffer.getChannelData(0);
        let energy = 0;
        for (let i = 0; i < samples.length; i += 16) energy += samples[i] ** 2;
        return { name, seconds: buffer.duration, rms: Math.sqrt(energy / Math.ceil(samples.length / 16)) };
      }));
    } finally { await context.close(); }
  });
  expect(levels.map(item => item.name)).toEqual(["room", "outside", "voices"]);
  for (const item of levels) {
    expect(item.seconds).toBeCloseTo(4, 1);
    expect(item.rms).toBeGreaterThan(.01);
  }
  expect(new Set(levels.map(item => item.rms.toFixed(4))).size).toBe(3);
});
