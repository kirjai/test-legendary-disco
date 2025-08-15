import { vi } from "vitest";
import type { NagerClient } from "../nager.client.interface";

export class MockNagerClient implements NagerClient {
	loadPublicHolidaysForYearAndCountry = vi.fn();
}
