import { createUseDashboardController } from "./application/controllers/dashboard.controller";
import { createUseWelcomeController } from "./application/controllers/welcome.controller";
import { AnalyticsService } from "./domains/analytics/analytics.service";
import { AuthenticationService } from "./domains/authentication/authentication.service";
import { FeedService } from "./domains/feed/feed.service";
import { EventBus } from "./infrastructure/event-bus/event-bus";
import { GlobalCacheMemory } from "./infrastructure/global-cache-memory/global-cache-memory";
import { NagerClient } from "./infrastructure/nager/nager.client";
import { NetworkManagerService } from "./infrastructure/network-manager/network-manager.service";

// Infrastructure layer
const networkManager = new NetworkManagerService();
const nagerClient = new NagerClient(networkManager);
const eventBus = new EventBus();
const globalCacheMemory = new GlobalCacheMemory();

// Domain layer
const authenticationService = new AuthenticationService();
const feedService = new FeedService(nagerClient);
const analyticsService = new AnalyticsService(
	nagerClient,
	globalCacheMemory,
	eventBus,
);

// Application layer
export const useWelcomeController = createUseWelcomeController(
	authenticationService,
);
export const useDashboardController = createUseDashboardController(
	feedService,
	analyticsService,
	eventBus,
);
