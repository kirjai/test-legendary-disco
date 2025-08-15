import type { Analytics, AnalyticsResult } from "./model/analytics.model";
import type { AnalyticsReportEvent } from "../shared/events/domain-events";
import type { AnalyticsService as IAnalyticsService } from "./analytics.service.interface";
import type { Cache } from "@/infrastructure/global-cache-memory/cache.interface";
import type { EventBus } from "@/infrastructure/event-bus/event-bus.interface";
import type {
	NagerClient,
	PublicHoliday,
} from "@/infrastructure/nager/nager.client.interface";

export class AnalyticsService implements IAnalyticsService {
	constructor(
		private readonly nagerClient: NagerClient,
		private readonly cache: Cache,
		private readonly eventBus: EventBus,
	) {}

	loadAnalytics(callbacks: {
		onSuccess: (result: AnalyticsResult) => void;
		onError: (error: Error) => void;
	}) {
		// add some variance for the different amount of holidays in different years
		const randomYear = Math.floor(Math.random() * 26) + 2000;
		const randomCountry = ["LV", "GB", "US", "CA", "AU"][
			Math.floor(Math.random() * 5)
		];
		const cacheKey = `analytics-${randomYear}-${randomCountry}`;

		this.nagerClient.loadPublicHolidaysForYearAndCountry(
			randomYear,
			randomCountry,
			{
				onSuccess: (holidays) => {
					const analytics = this.publicHolidaysToAnalytics(holidays);
					const analyticsResult = this.asAnalyticsResult(
						analytics,
						randomCountry,
						randomYear,
					);

					if (analyticsResult._tag === "Cached") {
						this.cache.set(cacheKey, analytics);
					}

					callbacks.onSuccess(analyticsResult);

					this.eventBus.publish(this.toAnalyticsReportEvent(analytics));
				},
				onError: (error) => {
					callbacks.onError(error);
				},
			},
		);
	}

	private toAnalyticsReportEvent(analytics: Analytics): AnalyticsReportEvent {
		return {
			_tag: "AnalyticsReportEvent",
			payload: {
				totalInYear: analytics.totalInYear,
			},
		};
	}

	private asAnalyticsResult(
		analytics: Analytics,
		country: string,
		year: number,
	): AnalyticsResult {
		if (analytics.totalInYear % 2 === 0) {
			return {
				_tag: "Sync",
				analytics,
				country,
				year,
			};
		}
		return {
			_tag: "Cached",
			country,
			year,
		};
	}

	private publicHolidaysToAnalytics(holidays: PublicHoliday[]): Analytics {
		const holidaysInMonths = holidays
			.map(this.holidayToHolidayInMonth)
			.reduce(this.holidaysInMonthsSemigroup, new Map<string, number>());

		const most =
			Array.from(holidaysInMonths.entries()).sort(
				([, aCount], [, bCount]) => bCount - aCount,
			)[0] ?? null;

		return {
			totalInYear: holidays.length,
			mostInMonth: most,
		};
	}

	private holidaysInMonthsSemigroup(
		a: HolidaysInMonths,
		b: HolidaysInMonths,
	): HolidaysInMonths {
		const merged = new Map(a);
		// Merge the two maps, adding the counts of the same month
		for (const [month, count] of b.entries()) {
			const existingCount = merged.get(month) ?? 0;
			merged.set(month, existingCount + count);
		}
		return merged;
	}

	private holidayToHolidayInMonth(holiday: PublicHoliday): HolidaysInMonths {
		const date = new Date(holiday.date);
		const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
			date,
		);
		return new Map([[month, 1]]);
	}
}

type HolidaysInMonths = Map<string, number>;
