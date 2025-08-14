import { createUseDashboardController } from "./application/controllers/dashboard.controller";
import { createUseWelcomeController } from "./application/controllers/welcome.controller";
import { AuthenticationService } from "./domains/authentication/authentication.service";
import { FeedService } from "./domains/feed/feed.service";
import { NagerClient } from "./infrastructure/nager/nager.client";
import { NetworkManagerService } from "./infrastructure/network-manager/network-manager.service";

// Infrastructure layer
const networkManager = new NetworkManagerService();
const nagerClient = new NagerClient(networkManager);

// Domain layer
const authenticationService = new AuthenticationService();
const feedService = new FeedService(nagerClient);

// Application layer
export const useWelcomeController = createUseWelcomeController(
	authenticationService,
);
export const useDashboardController = createUseDashboardController(feedService);
