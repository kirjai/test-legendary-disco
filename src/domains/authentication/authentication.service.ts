export class AuthenticationService {
	private readonly accessCodes: Set<string>;

	constructor() {
		this.accessCodes = new Set(
			["ALFA-1234", "BETA-5678", "GAMMA-9012"].map(this.normalizeCode),
		);
	}

	isValidAccessCode(code: string) {
		return this.accessCodes.has(this.normalizeCode(code));
	}

	private normalizeCode(code: string) {
		return code.toLowerCase().trim();
	}
}
