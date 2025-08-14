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
				loadingComponent={<div>Loading...</div>}
				errorComponent={() => <div>Error</div>}
				dataComponent={(data) => {
					if (data.length === 0) {
						return <div>No results</div>;
					}

					return (
						<div>
							{data.map((item) => (
								<div key={item.day.getTime()}>{item.name}</div>
							))}
						</div>
					);
				}}
			/>
		</div>
	);
};
