import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../../src/utils/token";

//later when the dom related testing grows we can install jsdom, for now its better to just mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("token utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no access token exists", () => {
    localStorageMock.getItem.mockReturnValue(null);

    expect(getAccessToken()).toBeNull();
    expect(localStorageMock.getItem).toHaveBeenCalledWith("token");
  });

  it("stores and retrieves an access token", () => {
    setAccessToken("test-token");

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "token",
      "test-token",
    );

    localStorageMock.getItem.mockReturnValue("test-token");

    expect(getAccessToken()).toBe("test-token");
  });

  it("clears the access token", () => {
    clearAccessToken();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  });
});
