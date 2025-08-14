import { createUseWelcomeController } from "./application/controllers/welcome.controller";
import { AuthenticationService } from "./domains/authentication/authentication.service";

const authenticationService = new AuthenticationService();

export const useWelcomeController = createUseWelcomeController(
	authenticationService,
);
