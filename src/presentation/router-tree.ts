import { indexRoute } from "./routes"
import { rootRoute } from "./routes/__root"
import { dashboardRoute } from "./routes/dashboard"

export const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute])
