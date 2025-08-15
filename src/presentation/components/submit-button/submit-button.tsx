export const SubmitButton = (
	props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
	return (
		<button
			className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			{...props}
		>
			Submit
		</button>
	);
};
