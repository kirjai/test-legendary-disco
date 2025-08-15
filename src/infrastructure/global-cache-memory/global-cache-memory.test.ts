import { expect, test, describe } from "vitest";
import { GlobalCacheMemory } from "./global-cache-memory";

describe("GlobalCacheMemory", () => {
	test("should set and get value", () => {
		const instance = new GlobalCacheMemory();

		instance.set("test", "value");

		expect(instance.get("test")).toBe("value");
	});
});
