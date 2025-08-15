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
			loadingComponent={
				<div className="flex items-center justify-center py-8">
					<div className="text-gray-500">Loading analytics...</div>
				</div>
			}
			errorComponent={() => (
				<div className="flex items-center justify-center py-8">
					<div className="text-red-600 bg-red-50 px-4 py-2 rounded-md border border-red-200">
						Error loading analytics data
					</div>
				</div>
			)}
			dataComponent={(data) => {
				return (
					<div className="space-y-4">
						<h2 className="text-lg font-semibold text-gray-900">
							Analytics Overview
						</h2>

						{data._tag === "Cached" ? (
							<Cached country={data.country} year={data.year} />
						) : (
							<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="p-4 bg-green-50 rounded-md border border-green-200">
									<dt className="text-green-800 font-medium flex flex-col">
										<span>Total Holidays</span>
										<span className="text-sm text-green-700 mt-1">
											{" "}
											in {data.year} in {data.country}
										</span>
									</dt>
									<dd className="text-2xl font-bold text-green-900 mt-1">
										{data.analytics.totalInYear}
									</dd>
								</div>
								{data.analytics.mostInMonth ? (
									<div className="p-4 bg-purple-50 rounded-md border border-purple-200">
										<dt className="text-purple-800 font-medium">Peak Month</dt>
										<dd className="flex flex-col">
											<span className="text-2xl font-bold text-purple-900 mt-1">
												{data.analytics.mostInMonth[0]}
											</span>
											<span className="text-sm text-purple-700 mt-1">
												{data.analytics.mostInMonth[1]} holidays
											</span>
										</dd>
									</div>
								) : null}
							</dl>
						)}
					</div>
				);
			}}
		/>
	);
};

const Cached = ({ country, year }: { country: string; year: number }) => {
	return (
		<div className="p-4 bg-blue-50 rounded-md border border-blue-200">
			<div className="flex items-center">
				<div className="text-blue-800">
					<svg
						className="w-5 h-5 mr-2 inline"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
					Cached Data
				</div>
			</div>
			<div className="mt-2 text-blue-700">
				{country} {year} analytics (from cache)
			</div>
		</div>
	);
};
