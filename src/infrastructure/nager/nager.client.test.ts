import { expect, test, describe, vi } from "vitest";
import { NagerClient, ParseError } from "./nager.client";
import { MockNetworkManager } from "../network-manager/mocks/network-manager.mock";

describe("NagerClient", () => {
	test("should load public holidays for a given year and country", () => {
		const mockRes = new MockNetworkManager();
		const instance = new NagerClient(mockRes);

		instance.loadPublicHolidaysForYearAndCountry(2024, "US", {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		});

		expect(mockRes.requestJSON).toHaveBeenCalledWith(
			new Request("https://date.nager.at/api/v3/PublicHolidays/2024/US"),
			expect.any(Object),
		);
	});

	test("should invoke the callback with a successfully parsed response", () => {
		const mockRes = new MockNetworkManager();
		const mockData = [{ date: "2024-01-01", name: "New Year" }];
		mockRes.requestJSON.mockImplementation((_, callbacks) => {
			callbacks.onSuccess(mockData);
		});
		const instance = new NagerClient(mockRes);
		const onSuccess = vi.fn();

		instance.loadPublicHolidaysForYearAndCountry(2024, "US", {
			onSuccess,
			onError: vi.fn(),
		});

		expect(onSuccess).toHaveBeenCalledWith(mockData);
	});

	test("should invoke the callback with a parse error if response is not valid", () => {
		const mockRes = new MockNetworkManager();
		// date is missing, but is required by the schema
		const mockData = [{ name: "New Year" }];
		mockRes.requestJSON.mockImplementation((_, callbacks) => {
			callbacks.onSuccess(mockData);
		});
		const instance = new NagerClient(mockRes);
		const onError = vi.fn();

		instance.loadPublicHolidaysForYearAndCountry(2024, "US", {
			onSuccess: vi.fn(),
			onError,
		});

		expect(onError).toHaveBeenCalledWith(expect.any(ParseError));
	});
});
