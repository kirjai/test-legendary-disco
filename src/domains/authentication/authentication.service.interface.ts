export interface AuthenticationService {
	isAccessCodeValid(code: string): boolean;
	createSession(code: string): void;
	hasSession(): boolean;
}

export class InvalidAccessCodeError extends Error {
	constructor(code: string) {
		super(`Invalid access code: ${code}`);
	}
}
