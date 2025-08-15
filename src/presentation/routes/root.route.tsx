import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "../query-client/query-client";

export const rootRoute = createRootRoute({
	component: () => (
		<>
			<QueryClientProvider>
				<Outlet />
			</QueryClientProvider>
		</>
	),
});
