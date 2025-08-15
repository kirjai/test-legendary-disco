import { vi } from "vitest";
import type { EventBus } from "../event-bus.interface";

export class MockEventBus implements EventBus {
	publish = vi.fn();
	subscribe = vi.fn();
}
