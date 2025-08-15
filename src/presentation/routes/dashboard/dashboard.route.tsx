import { useDashboardController } from "@/composition-root";
import { Tabs } from "@base-ui-components/react/tabs";
import { createRoute } from "@tanstack/react-router";
import z from "zod";
import { rootRoute } from "../root.route";
import { Feed } from "./feed";
import { Analytics } from "./analytics";

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
		const { setView, view, feedQuery, analyticsQuery, totalHolidaysCounter } =
			useDashboardController();

		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="mt-2 text-sm text-gray-600">
							Total holidays: {totalHolidaysCounter}
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<Tabs.Root value={view} onValueChange={setView}>
							<Tabs.List className="flex border-b border-gray-200">
								<TabTrigger value="feed">Feed</TabTrigger>
								<TabTrigger value="analytics">Analytics</TabTrigger>
							</Tabs.List>

							<div className="p-6">
								<Tabs.Panel value="feed">
									<Feed query={feedQuery} />
								</Tabs.Panel>
								<Tabs.Panel value="analytics">
									<Analytics query={analyticsQuery} />
								</Tabs.Panel>
							</div>
						</Tabs.Root>
					</div>
				</div>
			</div>
		);
	},
});

const TabTrigger = ({
	value,
	children,
}: { value: string; children: React.ReactNode }) => {
	return (
		<Tabs.Tab
			value={value}
			className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-colors duration-200"
		>
			{children}
		</Tabs.Tab>
	);
};
