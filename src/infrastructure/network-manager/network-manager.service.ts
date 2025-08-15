import { NetworkError } from "./network-manager.interface";

/**
 * Encapsulates communication via the network.
 */
export class NetworkManagerService implements NetworkManagerService {
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
					throw new NetworkError(
						"Network response was not ok",
						{ cause: response },
						request,
					);
				}
				return response.json();
			})
			.then((data) => callbacks.onSuccess(data))
			.catch((error) => {
				const asError =
					error instanceof Error
						? error
						: new NetworkError(
								"Unknown fetch error",
								{ cause: error },
								request,
							);
				callbacks.onError(asError);
			});
	}
}
