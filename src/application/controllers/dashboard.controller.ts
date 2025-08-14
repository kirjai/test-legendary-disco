import type { FeedService } from "@/domains/feed/feed.service";
import type { DataFeedItem } from "@/domains/feed/model/data-feed-item.model";
import { dashboardRoute } from "@/presentation/routes/dashboard/dashboard.route";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const createUseDashboardController = (feedService: FeedService) => {
	const loadFeed = () =>
		new Promise<DataFeedItem[]>((resolve, reject) => {
			feedService.loadDataFeed({
				onSuccess: resolve,
				onError: reject,
			});
		});

	return () => {
		const navigate = useNavigate({ from: dashboardRoute.fullPath });
		const { view } = dashboardRoute.useSearch();

		const feedQuery = useQuery({
			queryKey: ["feed", view],
			queryFn: view === "feed" ? loadFeed : skipToken,
		});

		useEffect(() => {
			if (feedQuery.error) {
				console.error(feedQuery.error);
			}
		}, [feedQuery.error]);

		const setView = (view: "feed" | "analytics") => {
			navigate({ search: { view } });
		};

		return {
			setView,
			view,
			feedQuery,
		};
	};
};
