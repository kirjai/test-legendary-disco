import { SubmitButton } from "@/presentation/components/submit-button/submit-button";
import { TextField } from "@/presentation/components/text-field/text-field";
import {
	fieldContext,
	formContext,
} from "@/presentation/form-context/form-hook-contexts";
import { createFormHook } from "@tanstack/react-form";

export const { useAppForm: useWelcomeForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
