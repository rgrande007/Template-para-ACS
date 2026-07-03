import { describe, expect, it } from "vitest";
import { isRateLimited } from "./rateLimit";

function uniqueKey(label: string): string {
  return `${label}-${Math.random()}`;
}

describe("isRateLimited", () => {
  it("allows the first five requests from a fresh key", () => {
    const key = uniqueKey("allow");
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  it("blocks once a key exceeds five requests within the window", () => {
    const key = uniqueKey("block");
    for (let i = 0; i < 5; i++) isRateLimited(key);
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks each key independently", () => {
    const keyA = uniqueKey("a");
    const keyB = uniqueKey("b");
    for (let i = 0; i < 6; i++) isRateLimited(keyA);
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
