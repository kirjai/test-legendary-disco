export type DomainEvent = AnalyticsReportEvent;

export interface AnalyticsReportEvent {
	_tag: "AnalyticsReportEvent";
	payload: {
		totalInYear: number;
	};
};
