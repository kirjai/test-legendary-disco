import { isErrorWithMessage } from "@/lib/error/is-error-with-message";
import { useFieldContext } from "@/presentation/form-context/form-hook-contexts";
import { useId, type ReactNode } from "react";

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
		<div className="space-y-2">
			<label className="block">
				<span className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</span>

				<input
					type="text"
					value={field.state.value}
					onChange={(event) => field.handleChange(event.target.value)}
					onBlur={field.handleBlur}
					aria-invalid={hasError}
					aria-describedby={hasError ? errorId : undefined}
					className={`
						w-full px-3 py-2 border rounded-md shadow-sm
						focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
						${
							hasError
								? "border-red-300 focus:ring-red-500 focus:border-red-500"
								: "border-gray-300"
						}
					`}
					{...inputProps}
				/>
			</label>

			<ul
				id={errorId}
				className="text-sm text-red-600 space-y-1 min-h-5"
				aria-hidden={!hasError}
			>
				{errors.map((error, index) => (
					// no better hueristic to determine the key available
					<li key={index}>{error.message}</li>
				))}
			</ul>
		</div>
	);
};
