import z from "zod";

export interface NagerClient {
	loadPublicHolidaysForYearAndCountry(
		year: number,
		countryCode: string,
		callbacks: {
			onSuccess: (holidays: PublicHoliday[]) => void;
			onError: (error: Error) => void;
		},
	): void;
}

/**
 * There are more properties, but these are the only one we need.
 *
 * @see https://date.nager.at/Api
 */
export const PublicHoliday = z.object({
	date: z.string(),
	name: z.string(),
});
export interface PublicHoliday extends z.infer<typeof PublicHoliday> {}
