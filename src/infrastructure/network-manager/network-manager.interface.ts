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
		public readonly response: Response | null,
	) {
		super(message, { cause });
	}
}

export class InvalidJSONError extends Error {
	constructor(
		message: string,
		cause: unknown,
		public readonly response: unknown,
	) {
		super(message, { cause });
	}
}
