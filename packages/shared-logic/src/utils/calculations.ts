import { Motorcycle } from "../api/motorcycles";

export function calculateTotalMilesTracked(motorcycles: Motorcycle[]): number {
	// TODO: Implement actual calculation based on user's motorcycle data
	return motorcycles.reduce(
		(sum, bike) => sum + (bike.totalMilesLogged || 0),
		0
	);
}

export function calculateAverageCostPerMile(motorcycles: Motorcycle[]): number {
	// TODO: Implement actual calculation based on user's tire and maintenance data
	return 0.03; // Placeholder
}

export function calculateActiveBikes(motorcycles: Motorcycle[]): number {
	return motorcycles.length;
}
