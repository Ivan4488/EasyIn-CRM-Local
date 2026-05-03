import { describe, expect, it } from "vitest";
import {
  normalizeEmployeeCountEntries,
  getEmployeeCountPrimaryValue,
} from "./employeeCount";

describe("employeeCount normalization", () => {
  it("keeps standard canonical rows and range as primary", () => {
    const rows = normalizeEmployeeCountEntries([
      { id: "1", label: "Employee count low", value: 51, source: "LinkedIn", isPrimary: false, sortOrder: 0 },
      { id: "2", label: "Employee count high", value: 200, source: "LinkedIn", isPrimary: false, sortOrder: 1 },
      { id: "3", label: "Full range", value: "51–200", source: "LinkedIn", isPrimary: true, sortOrder: 2 },
      { id: "4", label: "Employees on LinkedIn", value: 120, source: "LinkedIn", isPrimary: false, sortOrder: 3 },
    ]);

    expect(rows).toHaveLength(4);
    expect(getEmployeeCountPrimaryValue(rows)).toBe("51–200");
  });

  it("backs non-standard high row to --", () => {
    const rows = normalizeEmployeeCountEntries([
      { id: "1", label: "Employee count low", value: 10001, source: "LinkedIn", isPrimary: false, sortOrder: 0 },
      { id: "3", label: "Full range", value: "10001+", source: "LinkedIn", isPrimary: true, sortOrder: 2 },
      { id: "4", label: "Employees on LinkedIn", value: 18000, source: "LinkedIn", isPrimary: false, sortOrder: 3 },
    ], "10001+");

    const high = rows.find((r) => r.label === "Employee count high");
    expect(high).toBeTruthy();
    expect(String(high?.value)).toBe("--");
  });

  it("ensures one primary and defaults to range", () => {
    const rows = normalizeEmployeeCountEntries([
      { id: "range", label: "Full range", value: "51–200", source: "LinkedIn", isPrimary: false, sortOrder: 2 },
      { id: "a1", label: "Additional 1", value: "250", source: "User", isPrimary: false, sortOrder: 4 },
    ], "51–200");

    const primary = rows.find((r) => r.isPrimary);
    expect(primary).toBeTruthy();
    expect(primary?.label).toBe("Full range");
  });

  it("falls back to range primary after custom primary is removed", () => {
    const beforeDelete = normalizeEmployeeCountEntries([
      { id: "range", label: "Full range", value: "51–200", source: "LinkedIn", isPrimary: false, sortOrder: 2 },
      { id: "a1", label: "Additional 1", value: "250", source: "User", isPrimary: true, sortOrder: 4 },
    ], "51–200");

    const afterDeleteInput = beforeDelete.filter((r) => r.id !== "a1").map((r) => ({
      ...r,
      isPrimary: false,
    }));

    const afterDelete = normalizeEmployeeCountEntries(afterDeleteInput, "51–200");
    const primary = afterDelete.find((r) => r.isPrimary);

    expect(primary).toBeTruthy();
    expect(primary?.label).toBe("Full range");
  });

  it("parses comma-formatted numbers into numericValue", () => {
    const rows = normalizeEmployeeCountEntries([
      { id: "1", label: "Employee count low", value: "10,001", source: "LinkedIn", isPrimary: false, sortOrder: 0 },
      { id: "3", label: "Full range", value: "10,001+", source: "LinkedIn", isPrimary: true, sortOrder: 2 },
    ], "10,001+");

    const low = rows.find((r) => r.label === "Employee count low");
    expect(low?.numericValue).toBe(10001);
  });

  it("keeps invalid custom value but normalizes numericValue to null", () => {
    const rows = normalizeEmployeeCountEntries([
      { id: "a1", label: "Additional 1", value: "", source: "User", isPrimary: false, sortOrder: 4 },
    ], "51–200");

    const custom = rows.find((r) => r.id === "a1");
    expect(custom).toBeTruthy();
    expect(custom?.value).toBe("");
    expect(custom?.numericValue).toBeNull();
  });
});
