/**
 * Encapsulates communication via the network.
 */
export class NetworkManagerService {
	/**
	 * Makes a request to the network and returns the parsed JSON response.
	 */
	requestJSON(
		request: Request,
		callbacks: {
			onSuccess: (data: unknown) => void;
			onError: (error: Error) => void;
		},
	) {
		return fetch(request)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok", { cause: response });
				}
				return response.json();
			})
			.then((data) => callbacks.onSuccess(data))
			.catch((error) => {
				const asError =
					error instanceof Error
						? error
						: new Error("Unknown fetch error", { cause: error });
				callbacks.onError(asError);
			});
	}
}
