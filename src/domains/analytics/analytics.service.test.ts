import type { EventBus } from "@/infrastructure/event-bus/event-bus.interface";
import { MockEventBus } from "@/infrastructure/event-bus/mocks/event-bus.mock";
import type { Cache } from "@/infrastructure/global-cache-memory/cache.interface";
import { MockCache } from "@/infrastructure/global-cache-memory/mocks/cache.mock";
import { MockNagerClient } from "@/infrastructure/nager/mocks/nager.client.mock";
import type {
	NagerClient,
	PublicHoliday,
} from "@/infrastructure/nager/nager.client.interface";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { AnalyticsService } from "./analytics.service";

const evenMockHolidays: PublicHoliday[] = [
	{ date: "2023-01-01", name: "New Year Day" },
	{ date: "2023-01-15", name: "Martin Luther King Jr. Day" },
	{ date: "2023-02-20", name: "Presidents Day" },
	{ date: "2023-05-29", name: "Memorial Day" },
	{ date: "2023-07-04", name: "Independence Day" },
	{ date: "2023-09-04", name: "Labor Day" },
	{ date: "2023-11-23", name: "Thanksgiving Day" },
	{ date: "2023-12-25", name: "Christmas Day" },
];

describe("AnalyticsService", () => {
	let mockNagerClient: NagerClient;
	let mockCache: Cache;
	let mockEventBus: EventBus;
	let analyticsService: AnalyticsService;
	let originalMathRandom: typeof Math.random;

	beforeEach(() => {
		mockNagerClient = new MockNagerClient();
		mockCache = new MockCache();
		mockEventBus = new MockEventBus();
		originalMathRandom = Math.random;
		Math.random = vi.fn();

		analyticsService = new AnalyticsService(
			mockNagerClient,
			mockCache,
			mockEventBus,
		);
	});

	afterEach(() => {
		Math.random = originalMathRandom;
	});

	describe("loadAnalytics", () => {
		test("should generate random year and country and call nager client", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.5) // year: Math.floor(0.5 * 26) + 2000 = 2013
				.mockReturnValueOnce(0.6); // country: Math.floor(0.6 * 5) = 3 (CA)

			analyticsService.loadAnalytics({
				onSuccess: vi.fn(),
				onError: vi.fn(),
			});

			expect(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).toHaveBeenCalledWith(2013, "CA", expect.any(Object));
		});

		test("should process holidays and return Sync result when total is even", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			// Even number of holidays
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(evenMockHolidays);
			});
			const onSuccess = vi.fn();
			const onError = vi.fn();

			analyticsService.loadAnalytics({ onSuccess, onError });

			expect(onSuccess).toHaveBeenCalledWith({
				_tag: "Sync",
				analytics: {
					totalInYear: 8,
					mostInMonth: ["January", 2],
				},
				country: "LV",
				year: 2000,
			});
			expect(onError).not.toHaveBeenCalled();
		});

		test("should process holidays and return Cached result when total is odd", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			// Odd number of holidays
			const oddHolidays = evenMockHolidays.slice(0, 7);
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(oddHolidays);
			});
			const onSuccess = vi.fn();
			const onError = vi.fn();

			analyticsService.loadAnalytics({ onSuccess, onError });

			expect(onSuccess).toHaveBeenCalledWith({
				_tag: "Cached",
				country: "LV",
				year: 2000,
			});
			expect(onError).not.toHaveBeenCalled();
		});

		test("should set cache when result is Cached", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			// Odd number of holidays
			const oddHolidays = evenMockHolidays.slice(0, 7);
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(oddHolidays);
			});

			analyticsService.loadAnalytics({
				onSuccess: vi.fn(),
				onError: vi.fn(),
			});

			expect(mockCache.set).toHaveBeenCalledWith("analytics-2000-LV", {
				totalInYear: 7,
				mostInMonth: ["January", 2],
			});
		});

		test("should not set cache when result is Sync", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			// Even number of holidays
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(evenMockHolidays);
			});

			analyticsService.loadAnalytics({
				onSuccess: vi.fn(),
				onError: vi.fn(),
			});

			expect(mockCache.set).not.toHaveBeenCalled();
		});

		test("should publish analytics report event", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			// Even number of holidays
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(evenMockHolidays);
			});

			analyticsService.loadAnalytics({
				onSuccess: vi.fn(),
				onError: vi.fn(),
			});

			expect(mockEventBus.publish).toHaveBeenCalledWith({
				_tag: "AnalyticsReportEvent",
				payload: {
					totalInYear: 8,
				},
			});
		});
	});

	describe("holiday processing logic", () => {
		test("should handle single holiday", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			const singleHoliday: PublicHoliday[] = [
				{ date: "2023-12-25", name: "Christmas Day" },
			];
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess(singleHoliday);
			});
			const onSuccess = vi.fn();

			analyticsService.loadAnalytics({ onSuccess, onError: vi.fn() });

			expect(onSuccess).toHaveBeenCalledWith({
				_tag: "Cached",
				country: "LV",
				year: 2000,
			});
			expect(mockCache.set).toHaveBeenCalledWith("analytics-2000-LV", {
				totalInYear: 1,
				mostInMonth: ["December", 1],
			});
		});

		test("should handle empty holidays array", () => {
			vi.mocked(Math.random)
				.mockReturnValueOnce(0.0) // year: 2000
				.mockReturnValueOnce(0.0); // country: LV
			vi.mocked(
				mockNagerClient.loadPublicHolidaysForYearAndCountry,
			).mockImplementation((_, __, callbacks) => {
				callbacks.onSuccess([]);
			});
			const onSuccess = vi.fn();

			analyticsService.loadAnalytics({ onSuccess, onError: vi.fn() });

			expect(onSuccess).toHaveBeenCalledWith({
				_tag: "Sync",
				analytics: {
					totalInYear: 0,
					mostInMonth: null,
				},
				country: "LV",
				year: 2000,
			});
		});
	});
});
