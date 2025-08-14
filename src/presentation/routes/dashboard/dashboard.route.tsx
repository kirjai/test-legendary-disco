import { useDashboardController } from "@/composition-root";
import { Tabs } from "@base-ui-components/react/tabs";
import { createRoute } from "@tanstack/react-router";
import z from "zod";
import { rootRoute } from "../root.route";
import { Feed } from "./feed";

export const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	validateSearch: z.object({
		view: z
			.union([z.literal("feed"), z.literal("analytics")])
			.default("feed")
			.catch("feed"),
	}),
	component: function Dashboard() {
		const { setView, view, feedQuery } = useDashboardController();

		return (
			<div>
				Dashboard
				<Tabs.Root value={view} onValueChange={setView}>
					<Tabs.List>
						<Tabs.Tab value="feed">Feed</Tabs.Tab>
						<Tabs.Tab value="analytics">Analytics</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="feed">
						<Feed query={feedQuery} />
					</Tabs.Panel>
					<Tabs.Panel value="analytics">
						<div>Analytics</div>
					</Tabs.Panel>
				</Tabs.Root>
			</div>
		);
	},
});
