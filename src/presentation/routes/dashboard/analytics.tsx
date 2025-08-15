import type { AnalyticsResult } from "@/domains/analytics/model/analytics.model";
import { QueryResult } from "@/presentation/components/query-result/query-result";
import type { UseQueryResult } from "@tanstack/react-query";

export const Analytics = ({
	query,
}: {
	query: UseQueryResult<AnalyticsResult, Error>;
}) => {
	return (
		<QueryResult
			query={query}
			loadingComponent={<div>Loading...</div>}
			errorComponent={() => <div>Error</div>}
			dataComponent={(data) => {
				if (data._tag === "Cached") {
					return (
						<div>
							{data.country} {data.year} - Cached
						</div>
					);
				}

				const mostInMonthSummary = data.analytics.mostInMonth ? (
					<>
						With the most holidays in {data.analytics.mostInMonth[0]} with{" "}
						{data.analytics.mostInMonth[1]} holidays.
					</>
				) : null;

				return (
					<div>
						In {data.year} in {data.country} there were{" "}
						{data.analytics.totalInYear} holidays. {mostInMonthSummary}
					</div>
				);
			}}
		/>
	);
};
