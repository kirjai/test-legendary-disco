import type { DataFeedItem } from "./model/data-feed-item.model";

export interface FeedService {
	loadDataFeed(callbacks: {
		onSuccess: (data: DataFeedItem[]) => void;
		onError: (error: Error) => void;
	}): void;
}
