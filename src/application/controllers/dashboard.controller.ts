import type { AnalyticsService } from "@/domains/analytics/analytics.service";
import type { AnalyticsResult } from "@/domains/analytics/model/analytics.model";
import type { FeedService } from "@/domains/feed/feed.service";
import type { DataFeedItem } from "@/domains/feed/model/data-feed-item.model";
import type { EventBus } from "@/infrastructure/event-bus/event-bus";
import { dashboardRoute } from "@/presentation/routes/dashboard/dashboard.route";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const createUseDashboardController = (
	feedService: FeedService,
	analyticsService: AnalyticsService,
	eventBus: EventBus,
) => {
	const loadFeed = () =>
		new Promise<DataFeedItem[]>((resolve, reject) => {
			feedService.loadDataFeed({
				onSuccess: resolve,
				onError: reject,
			});
		});
	const loadAnalytics = () =>
		new Promise<AnalyticsResult>((resolve, reject) => {
			analyticsService.loadAnalytics({
				onSuccess: resolve,
				onError: reject,
			});
		});

	return () => {
		const navigate = useNavigate({ from: dashboardRoute.fullPath });
		const { view } = dashboardRoute.useSearch();
		const [totalHolidaysCounter, setTotalHolidaysCounter] = useState(0);

		const feedQuery = useQuery({
			queryKey: ["feed", view],
			queryFn: view === "feed" ? loadFeed : skipToken,
		});

		const analyticsQuery = useQuery({
			queryKey: ["analytics", view],
			queryFn: view === "analytics" ? loadAnalytics : skipToken,
			// 							 5 seconds
			refetchInterval: 5 * 1_000,
		});

		useEffect(() => {
			const handler = eventBus.subscribe("AnalyticsReportEvent", (event) => {
				setTotalHolidaysCounter((prev) => prev + event.payload.totalInYear);
			});

			return () => handler.unsubscribe();
		}, []);

		useEffect(() => {
			if (analyticsQuery.error) {
				console.error(analyticsQuery.error);
			}
		}, [analyticsQuery.error]);

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
			analyticsQuery,
			totalHolidaysCounter,
		};
	};
};
