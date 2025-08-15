import { InvalidJSONError, NetworkError } from "./network-manager.interface";

/**
 * Encapsulates communication via the network.
 */
export class NetworkManagerService implements NetworkManagerService {
	constructor(private readonly fetchAPI: typeof fetch) {}

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
		return this.fetchAPI(request)
			.then((response) => {
				if (!response.ok) {
					throw new NetworkError(
						"Network response was not ok",
						{ cause: response },
						request,
						response,
					);
				}
				return response.json().catch((error) => {
					throw new InvalidJSONError(
						"Invalid JSON",
						{ cause: error },
						response,
					);
				});
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
								null,
							);
				callbacks.onError(asError);
			});
	}
}
