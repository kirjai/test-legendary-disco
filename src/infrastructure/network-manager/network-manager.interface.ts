export interface NetworkManager {
	requestJSON(
		request: Request,
		callbacks: {
			onSuccess: (data: unknown) => void;
			onError: (error: Error) => void;
		},
	): void;
}

export class NetworkError extends Error {
	constructor(
		message: string,
		cause: unknown,
		public readonly request: Request,
	) {
		super(message, { cause });
	}
}
