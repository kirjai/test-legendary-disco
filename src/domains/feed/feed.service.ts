import type {
	NagerClient,
	PublicHoliday,
} from "@/infrastructure/nager/nager.client";
import type { DataFeedItem } from "./model/data-feed-item.model";
import type { FeedService as IFeedService } from "./feed.service.interface";

export class FeedService implements IFeedService {
	constructor(private readonly nagerClient: NagerClient) {}

	loadDataFeed(callbacks: {
		onSuccess: (data: DataFeedItem[]) => void;
		onError: (error: Error) => void;
	}) {
		this.nagerClient.loadPublicHolidaysForYearAndCountry(2025, "GB", {
			onSuccess: (holidays) => {
				callbacks.onSuccess(this.publicHolidaysToDataFeedItems(holidays));
			},
			onError: (error) => callbacks.onError(error),
		});
	}

	/**
	 * Filters out invalid holidays
	 */
	private publicHolidaysToDataFeedItems(
		holidays: PublicHoliday[],
	): DataFeedItem[] {
		return holidays.flatMap((result) => {
			const asDataFeedItemResult = this.tryMakeDataFeedItem(result);
			return asDataFeedItemResult.success ? [asDataFeedItemResult.data] : [];
		});
	}

	private tryMakeDataFeedItem(
		holiday: PublicHoliday,
	):
		| { success: true; data: DataFeedItem }
		| { success: false; data: undefined } {
		const date = new Date(holiday.date);
		if (!isNaN(date.getTime())) {
			return { success: true, data: { day: date, name: holiday.name } };
		}

		return { success: false, data: undefined };
	}
}
