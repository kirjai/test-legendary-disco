import z from "zod";
import type { NetworkManager } from "../network-manager/network-manager.interface";

/**
 * Encapsulates communication with the Nager API.
 */
export class NagerClient {
	private readonly baseUrl = "https://date.nager.at";

	constructor(private readonly networkManager: NetworkManager) {}

	loadPublicHolidaysForYearAndCountry(
		year: number,
		/**
		 * ISO 3166-1 alpha-2
		 */
		countryCode: string,
		callbacks: {
			onSuccess: (holidays: PublicHoliday[]) => void;
			onError: (error: Error) => void;
		},
	) {
		const url = new URL(
			`/api/v3/PublicHolidays/${year}/${countryCode}`,
			this.baseUrl,
		);
		const request = new Request(url);

		return this.networkManager.requestJSON(request, {
			onSuccess: (responseBody) => {
				const parseResult =
					PublicHolidaysForYearAndCountryResponseBody.safeParse(responseBody);
				if (!parseResult.success) {
					const error = new ParseError(
						"Invalid public holidays response",
						parseResult.error,
						responseBody,
					);
					return callbacks.onError(error);
				}
				callbacks.onSuccess(parseResult.data);
			},
			onError: callbacks.onError,
		});
	}
}

/**
 * There are more properties, but these are the only one we need.
 *
 * @see https://date.nager.at/Api
 */
const PublicHoliday = z.object({
	date: z.string(),
	name: z.string(),
});
export interface PublicHoliday extends z.infer<typeof PublicHoliday> {}

const PublicHolidaysForYearAndCountryResponseBody = z.array(PublicHoliday);

export class ParseError extends Error {
	constructor(
		message: string,
		cause: unknown,
		public readonly got: unknown,
	) {
		super(message, { cause });
	}
}
