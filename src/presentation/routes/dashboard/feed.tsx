import type { DataFeedItem } from "@/domains/feed/model/data-feed-item.model";
import { QueryResult } from "@/presentation/components/query-result/query-result";
import type { UseQueryResult } from "@tanstack/react-query";

export const Feed = ({
	query,
}: {
	query: UseQueryResult<DataFeedItem[], Error>;
}) => {
	return (
		<div>
			<QueryResult
				query={query}
				loadingComponent={
					<div className="flex items-center justify-center py-8">
						<div className="text-gray-500">Loading feed...</div>
					</div>
				}
				errorComponent={() => (
					<div className="flex items-center justify-center py-8">
						<div className="text-red-600 bg-red-50 px-4 py-2 rounded-md border border-red-200">
							Error loading feed data
						</div>
					</div>
				)}
				dataComponent={(data) => {
					if (data.length === 0) {
						return (
							<div className="flex items-center justify-center py-8">
								<div className="text-gray-500">No feed items available</div>
							</div>
						);
					}

					return (
						<div className="space-y-3">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Holiday Feed
							</h2>
							<ol className="space-y-3">
								{data.map((item) => (
									<li
										key={item.day.getTime()}
										className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
									>
										<span className="font-medium text-gray-900 flex flex-col">
											{item.name}
										</span>
										<time
											dateTime={item.day.toISOString()}
											className="text-sm text-gray-600 mt-1"
										>
											{item.day.toLocaleDateString()}
										</time>
									</li>
								))}
							</ol>
						</div>
					);
				}}
			/>
		</div>
	);
};
