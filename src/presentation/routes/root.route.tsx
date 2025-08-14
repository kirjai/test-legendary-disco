import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClientProvider } from "../query-client/query-client";

export const rootRoute = createRootRoute({
	component: () => (
		<>
			<QueryClientProvider>
				<Outlet />
			</QueryClientProvider>
			<TanStackRouterDevtools />
		</>
	),
});
