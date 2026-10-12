import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { commissionCheckpoint, commissionPosition, commissionState, beginCommission,
  observeCompanyMap, receiveAppointment, enterCompany, signContract, beginExamination,
  chooseMedicalResponse, finishExamination, recallFarewell, leaveCompany } from "../src/content/state/companyCommissionState";
import { europeState } from "../src/content/state/europeReturnState";

afterEach(() => ["companyCommission", "commissionPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
it("requires recommendation, admission, contract and examination before departure", () => {
  expect(receiveAppointment()).toBe(false); expect(signContract()).toBe(false); expect(leaveCompany()).toBe(false);
  expect(beginCommission()).toBe(true); expect(beginCommission()).toBe(false);
  expect(beginExamination()).toBe(false); expect(enterCompany()).toBe(false);
  expect(receiveAppointment()).toBe(true); expect(receiveAppointment()).toBe(false);
  expect(enterCompany()).toBe(true); expect(signContract()).toBe(true);
  expect(recallFarewell()).toBe(false); expect(beginExamination()).toBe(true);
  expect(finishExamination()).toBe(false); expect(chooseMedicalResponse("return")).toBe(true);
  expect(finishExamination()).toBe(true); expect(recallFarewell()).toBe(true);
  expect(leaveCompany()).toBe(true); expect(leaveCompany()).toBe(false);
  expect(commissionState()).toEqual({ phase: "complete", mapObserved: false, medicalResponse: "return" });
  expect(europeState().phase).toBe("inactive");
});
it.each(["return", "question"] as const)("records the %s response once without changing the appointment", response => {
  beginCommission(); expect(chooseMedicalResponse(response)).toBe(false);
  receiveAppointment(); enterCompany(); signContract(); beginExamination();
  expect(chooseMedicalResponse(response)).toBe(true);
  expect(chooseMedicalResponse(response === "return" ? "question" : "return")).toBe(false);
  expect(commissionState().medicalResponse).toBe(response);
  expect(finishExamination()).toBe(true); expect(recallFarewell()).toBe(true);
});
it("makes map exploration optional and records it only before the medical examination", () => {
  expect(observeCompanyMap()).toBe(false); beginCommission();
  expect(observeCompanyMap()).toBe(true); expect(observeCompanyMap()).toBe(false);
  receiveAppointment(); enterCompany(); signContract(); beginExamination();
  expect(observeCompanyMap()).toBe(false); expect(commissionState().mapObserved).toBe(true);
});
it("accepts an earlier phase, the exact position and a pending choice without the return episode", () => {
  beginCommission(); receiveAppointment(); enterCompany(); signContract(); beginExamination();
  const pending = structuredClone(commissionState()); chooseMedicalResponse("question"); finishExamination(); recallFarewell(); leaveCompany();
  commissionCheckpoint.write(pending); expect(commissionState()).toEqual(pending);
  expect(finishExamination()).toBe(false); expect(chooseMedicalResponse("return")).toBe(true);
  commissionPosition.write({ x: 1234.75, y: 812.5 }); expect(commissionPosition.read()).toEqual({ x: 1234.75, y: 812.5 });
  expect(europeState().phase).toBe("inactive");
});
it("rejects impossible phases, premature choices, missing decisions and out-of-room coordinates", () => {
  const initial = commissionState();
  for (const patch of [{ phase: "returned" }, { phase: "inactive", mapObserved: true },
    { phase: "waiting", medicalResponse: "return" }, { phase: "cleared" }, { medicalResponse: "silent" }]) {
    storage.set("journey.companyCommission", { ...initial, ...patch } as never); expect(commissionState()).toEqual(initial);
  }
  for (const p of [{ x: 0, y: 800 }, { x: 500, y: NaN }, { x: 1600, y: 800 }]) {
    storage.set("journey.commissionPosition", p); expect(commissionPosition.read()).toBeUndefined();
  }
});
