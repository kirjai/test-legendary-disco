export interface AuthenticationService {
	isAccessCodeValid(code: string): boolean;
}
