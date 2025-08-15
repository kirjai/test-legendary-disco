import { vi } from "vitest";
import type { NetworkManager } from "../network-manager.interface";

export class MockNetworkManager implements NetworkManager {
	requestJSON = vi.fn();
}
