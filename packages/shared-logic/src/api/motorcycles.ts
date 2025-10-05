import { supabase } from "./supabase";
import { TireSet } from "./tires";

export interface Motorcycle {
	id: string;
	user_id: string;
	nickname: string;
	make: string;
	model: string;
	imageUrl?: string;
	totalMilesLogged?: number;
	active_tire_set?: TireSet | null;
	tire_sets?: TireSet[];
}

export async function getMotorcyclesForUser(): Promise<Motorcycle[] | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		console.warn("No authenticated user found.");
		return null;
	}

	const { data, error } = await supabase.rpc(
		"get_motorcycles_with_active_tires",
		{
			p_user_id: user.id,
		}
	);

	if (error) {
		console.error("Error fetching motorcycles with active tires:", error);
		return null;
	}

	return data as Motorcycle[];
}

export async function addMotorcycle(
	motorcycle: Omit<Motorcycle, "id" | "user_id" | "active_tire_set">
): Promise<Motorcycle | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		console.warn("No authenticated user found. Cannot add motorcycle.");
		return null;
	}

	const { data, error } = await supabase
		.from("motorcycles")
		.insert({
			...motorcycle,
			user_id: user.id,
		})
		.select()
		.single();

	if (error) {
		console.error("Error adding motorcycle:", error);
		return null;
	}

	return data as Motorcycle;
}

export async function getMotorcycleById(
	motorcycleId: string
): Promise<Motorcycle | null> {
	const { data, error } = await supabase.rpc("get_motorcycle_details", {
		p_motorcycle_id: motorcycleId,
	});

	if (error) {
		console.error("Error fetching motorcycle by ID:", error);
		return null;
	}

	return data as Motorcycle;
}