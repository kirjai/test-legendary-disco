import type { AnalyticsResult } from "./model/analytics.model";

export interface AnalyticsService {
	loadAnalytics(callbacks: {
		onSuccess: (result: AnalyticsResult) => void;
		onError: (error: Error) => void;
	}): void;
}
