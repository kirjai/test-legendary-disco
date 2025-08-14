import type { AuthenticationService } from "@/domains/authentication/authentication.service";
import { useNavigate } from "@tanstack/react-router";
import z from "zod";

const defaultFormValues = {
	code: "",
};

export const createUseWelcomeController = (
	authenticationService: AuthenticationService,
) => {
	const welcomeFormSchema = z.object({
		code: z
			.string()
			.trim()
			.min(1, "Access code is required")
			.refine((code) => authenticationService.isValidAccessCode(code), {
				error: "Unrecognized access code",
			}),
	});

	return () => {
		const navigate = useNavigate();

		const handleFormSubmit = () => {
			return navigate({ to: "/dashboard" });
		};

		return {
			welcomeFormSchema,
			defaultFormValues,
			handleFormSubmit,
		};
	};
};
