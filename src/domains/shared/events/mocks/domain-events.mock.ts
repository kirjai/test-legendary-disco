import type { AnalyticsReportEvent } from "../domain-events";

export const mockAnalyticsReportEvent: AnalyticsReportEvent = {
	_tag: "AnalyticsReportEvent",
	payload: {
		totalInYear: 10,
	},
};
