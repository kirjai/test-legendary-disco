import { useWelcomeController } from "@/composition-root";
import { RequiredIndicator } from "@/presentation/components/required-indicator/required-indicator";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root.route";
import { useWelcomeForm } from "./welcome-form";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: function Index() {
		const { welcomeFormSchema, defaultFormValues, handleFormSubmit } =
			useWelcomeController();
		const form = useWelcomeForm({
			defaultValues: defaultFormValues,
			validators: {
				onSubmit: welcomeFormSchema,
			},
			onSubmit: handleFormSubmit,
		});

		return (
			<main>
				<h1>Welcome</h1>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppField
						name="code"
						children={(field) => (
							<field.TextField
								label={
									<>
										Access code <RequiredIndicator />
									</>
								}
								inputProps={{
									required: true,
								}}
							/>
						)}
					/>

					<form.AppForm>
						<form.SubmitButton type="submit" />
					</form.AppForm>
				</form>
			</main>
		);
	},
});
