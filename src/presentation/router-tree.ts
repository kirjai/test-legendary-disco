import { indexRoute } from "./routes/index/index.route";
import { rootRoute } from "./routes/root.route";
import { dashboardRoute } from "./routes/dashboard/dashboard.route";

export const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);
