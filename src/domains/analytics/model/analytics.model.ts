export interface Analytics {
	totalInYear: number;
	/**
	 * Month with the most holidays, and the number of holidays in that month
	 */
	mostInMonth: [month: string, count: number];
}

export type AnalyticsResult = {
	country: string;
	year: number;
} & (
	| {
			_tag: "Sync";
			analytics: Analytics;
	  }
	| {
			_tag: "Cached";
	  }
);
