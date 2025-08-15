import {
	InvalidAccessCodeError,
	type AuthenticationService as IAuthenticationService,
} from "./authentication.service.interface";

export class AuthenticationService implements IAuthenticationService {
	private readonly accessCodes: Set<string>;
	private session: string | null = null;

	constructor() {
		this.accessCodes = new Set(
			["ALFA-1234", "BETA-5678", "GAMMA-9012"].map(this.normalizeCode),
		);
	}

	isAccessCodeValid(code: string) {
		return this.accessCodes.has(this.normalizeCode(code));
	}

	createSession(code: string) {
		if (!this.isAccessCodeValid(code)) {
			throw new InvalidAccessCodeError(code);
		}

		this.session = code;
	}

	hasSession() {
		return this.session !== null;
	}

	private normalizeCode(code: string) {
		return code.toLowerCase().trim();
	}
}
