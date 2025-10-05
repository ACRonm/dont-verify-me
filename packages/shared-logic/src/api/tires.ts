import { supabase } from "./supabase";

export interface TireSet {
	id: string;
	motorcycle_id: string;
	brand: string;
	model: string;
	position: "front" | "rear" | "set";
	is_active: boolean;
	install_date: string;
	install_odometer: number;
	cost?: number;
	currency?: string;
	end_date?: string;
	end_odometer?: number;
	manufacture_date?: string;
	expected_lifespan_miles?: number;
	created_at: string;
}

export async function getActiveTireSetForMotorcycle(
	motorcycleId: string
): Promise<TireSet | null> {
	if (!motorcycleId) {
		console.warn("No motorcycle ID provided to getActiveTireSetForMotorcycle.");
		return null;
	}

	const { data, error } = await supabase
		.from("tire_sets")
		.select("*")
		.eq("motorcycle_id", motorcycleId)
		.eq("is_active", true)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// This code means no rows were found, which is a valid case (no active tires)
			return null;
		}
		console.error(
			`Error fetching active tire set for motorcycle ${motorcycleId}:`,
			error
		);
		return null;
	}

	return data as TireSet;
}

export async function addTireSet(
	tireSet: Omit<TireSet, "id" | "is_active" | "created_at">
): Promise<TireSet | null> {
	const { data, error } = await supabase
		.from("tire_sets")
		.insert(tireSet)
		.select()
		.single();

	if (error) {
		console.error("Error adding tire set:", error);
		return null;
	}

	return data as TireSet;
}

export async function replaceTireSet(
	tireSetId: string,
	endDate: string,
	endOdometer: number
): Promise<TireSet | null> {
	if (!tireSetId) {
		console.warn("No tire set ID provided to replaceTireSet.");
		return null;
	}

	const { data, error } = await supabase
		.from("tire_sets")
		.update({
			is_active: false,
			end_date: endDate,
			end_odometer: endOdometer,
		})
		.eq("id", tireSetId)
		.select()
		.single();

	if (error) {
		console.error(`Error replacing tire set ${tireSetId}:`, error);
		return null;
	}

	return data as TireSet;
}
