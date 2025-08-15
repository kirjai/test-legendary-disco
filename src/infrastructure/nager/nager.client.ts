import z from "zod";
import type { NetworkManager } from "../network-manager/network-manager.interface";
import {
	PublicHoliday,
	type NagerClient as INagerClient,
} from "./nager.client.interface";

/**
 * Encapsulates communication with the Nager API.
 */
export class NagerClient implements INagerClient {
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
