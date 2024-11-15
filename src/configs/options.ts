import { formatDistanceEndTime } from "@/features/time";
import { tokens } from "./tokens";
import { format } from "date-fns";

export interface OptionsSelectExpiry {
	label: string;
	value: number; // mili seconds
}

export function getOptionsTimeExpiry(date = Date.now()) {
	const timestamps = [];
	const currentTimestamp = new Date(date).getTime();
	// Start of Day (8 AM current day or next day)
	const startOfDay = new Date(date);
	startOfDay.setUTCHours(8, 0, 0, 0);

	// Check if the current time has passed 8 AM
	if (startOfDay.getTime() <= date) {
		startOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Move to the next day
	}
	const startOfDayTimestamp = startOfDay.getTime();

	//dont show if the start of day is more than 12 hours away
	if (startOfDayTimestamp - currentTimestamp > 43200000) {
		timestamps.push(startOfDayTimestamp);
	}

	//add next day if the start of day is less than 36 hours away
	if (startOfDayTimestamp - currentTimestamp < 129600000) {
		const nextDay = new Date(date);
		nextDay.setUTCDate(nextDay.getUTCDate() + 1);
		nextDay.setUTCHours(8, 0, 0, 0);
		const nextDayTimestamp = nextDay.getTime();
		if (nextDayTimestamp - currentTimestamp > 43200000) {
			timestamps.push(nextDayTimestamp);
		}
	}

	//add 2nd day
	const day2 = new Date(date);
	day2.setUTCDate(day2.getUTCDate() + 2);
	day2.setUTCHours(8, 0, 0, 0);
	const day2Timestamp = day2.getTime();
	timestamps.push(day2Timestamp);

	//add 3rd day
	const day3 = new Date(date);
	day3.setUTCDate(day3.getUTCDate() + 3);
	day3.setUTCHours(8, 0, 0, 0);
	const day3Timestamp = day3.getTime();
	timestamps.push(day3Timestamp);

	const getWeekend = (week: number) => {
		const endOfWeek = new Date(date);
		const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
		endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday + week * 7);
		endOfWeek.setUTCHours(8, 0, 0, 0);
		return endOfWeek.getTime();
	};

	// End of Week (Friday) at 8 AM
	const week1 = getWeekend(0);
	const week2 = getWeekend(1);
	const week3 = getWeekend(2);
	const week4 = getWeekend(3);
	if (week1 - currentTimestamp > 43200000) timestamps.push(week1);

	timestamps.push(week2);
	timestamps.push(week3);
	timestamps.push(week4);
	// return unique timestamps
	return [...new Set(timestamps)];
}

export const getOptionsSelectExpiry = (date: Date): OptionsSelectExpiry[] => {
	const options = getOptionsTimeExpiry(date.getTime());

	return options.map((value) => {
		return {
			label: `${format(value, "d MMM yyyy , HH:mm")} (${formatDistanceEndTime(value)})`,
			value,
		};
	});
};

export const optionsTokenPair = [
	{
		name: "BTC/USDT",
		token: tokens.BTC,
		currency: tokens.USDT,
	},
	{
		name: "ETH/USDT",
		token: tokens.BTC,
		currency: tokens.USDT,
	},
];
