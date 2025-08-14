import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

export interface QueryResultProps<TData, TError> {
	query: UseQueryResult<TData, TError>;
	loadingComponent: ReactNode;
	errorComponent: (error: TError) => ReactNode;
	dataComponent: (data: TData) => ReactNode;
}

export const QueryResult = <TData, TError = Error>({
	query,
	dataComponent,
	loadingComponent,
	errorComponent,
}: QueryResultProps<TData, TError>): ReactNode => {
	if (query.status === "pending") return loadingComponent;
	if (query.status === "error") return errorComponent(query.error);

	return dataComponent(query.data);
};
