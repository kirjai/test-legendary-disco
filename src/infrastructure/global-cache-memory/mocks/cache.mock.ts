import { vi } from "vitest";
import type { Cache } from "../cache.interface";

export class MockCache implements Cache {
	get = vi.fn();
	set = vi.fn();
}
