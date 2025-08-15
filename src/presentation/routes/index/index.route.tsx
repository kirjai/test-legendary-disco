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
			<main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
						<p className="mt-2 text-sm text-gray-600">
							Please enter your access code to continue
						</p>
					</div>

					<div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
						<form
							className="space-y-6"
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
											placeholder: "Enter your access code",
										}}
									/>
								)}
							/>

							<form.AppForm>
								<form.SubmitButton type="submit" />
							</form.AppForm>
						</form>
					</div>
				</div>
			</main>
		);
	},
});
