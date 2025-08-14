import { useFieldContext } from "@/presentation/form-context/form-hook-contexts";
import { useId, type ReactNode } from "react";

const isErrorWithMessage = (error: unknown): error is { message: string } => {
	return typeof error === "object" && error !== null && "message" in error;
};

export const TextField = ({
	label,
	inputProps,
}: {
	label: ReactNode;
	inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
	const field = useFieldContext<string>();
	const errors = field.state.meta.errors.filter(isErrorWithMessage);
	const hasError = errors.length > 0;
	const fieldId = useId();
	const errorId = `${fieldId}-errors`;

	return (
		<div>
			<label>
				<span>{label}</span>

				<input
					type="text"
					value={field.state.value}
					onChange={(event) => field.handleChange(event.target.value)}
					onBlur={field.handleBlur}
					aria-invalid={hasError}
					aria-describedby={hasError ? errorId : undefined}
					{...inputProps}
				/>
			</label>

			{hasError ? (
				<ul id={errorId}>
					{errors.map((error, index) => (
						// no better hueristic to determine the key available
						<li key={index}>{error.message}</li>
					))}
				</ul>
			) : null}
		</div>
	);
};
