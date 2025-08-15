import type { AuthenticationService } from "@/domains/authentication/authentication.service";
import { indexRoute } from "@/presentation/routes/index/index.route";
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
			.refine((code) => authenticationService.isAccessCodeValid(code), {
				error: "Unrecognized access code",
			}),
	});

	return () => {
		const navigate = useNavigate({ from: indexRoute.fullPath });

		const handleFormSubmit = (
			formValues: z.infer<typeof welcomeFormSchema>,
		) => {
			authenticationService.createSession(formValues.code);

			return navigate({ to: "/dashboard" });
		};

		return {
			welcomeFormSchema,
			defaultFormValues,
			handleFormSubmit,
		};
	};
};
