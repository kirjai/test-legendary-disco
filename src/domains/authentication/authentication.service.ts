import type { AuthenticationService as IAuthenticationService } from "./authentication.service.interface";

export class AuthenticationService implements IAuthenticationService {
	private readonly accessCodes: Set<string>;

	constructor() {
		this.accessCodes = new Set(
			["ALFA-1234", "BETA-5678", "GAMMA-9012"].map(this.normalizeCode),
		);
	}

	isAccessCodeValid(code: string) {
		return this.accessCodes.has(this.normalizeCode(code));
	}

	private normalizeCode(code: string) {
		return code.toLowerCase().trim();
	}
}
