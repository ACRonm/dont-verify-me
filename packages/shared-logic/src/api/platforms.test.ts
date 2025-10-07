import {
	createPlatform,
	updatePlatform,
	deletePlatform,
	getAllPlatforms,
	getPublishedPlatforms,
	getPlatformBySlug,
	getPlatformBySlugAdmin,
	togglePlatformPublish,
	type Platform,
} from "./platforms";
import { supabase } from "./supabase";

// Mock the supabase module
jest.mock("./supabase", () => ({
	supabase: {
		auth: {
			getUser: jest.fn(),
		},
		from: jest.fn(),
	},
}));

describe("Platforms API - Authentication Tests", () => {
	const mockPlatform: Omit<Platform, "id" | "created_at" | "updated_at"> = {
		slug: "test-platform",
		name: "Test Platform",
		description: "Test description",
		is_published: false,
		display_order: 1,
	};

	const mockPlatformResponse: Platform = {
		id: "platform-123",
		slug: "test-platform",
		name: "Test Platform",
		description: "Test description",
		is_published: false,
		display_order: 1,
		created_at: "2025-01-01T00:00:00.000Z",
		updated_at: "2025-01-01T00:00:00.000Z",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("CREATE Platform - Authentication Required (via RLS)", () => {
		it("should create a platform when properly authenticated (RLS enforces)", async () => {
			const mockSelect = jest.fn().mockReturnValue({
				single: jest.fn().mockResolvedValue({
					data: mockPlatformResponse,
					error: null,
				}),
			});

			const mockInsert = jest.fn().mockReturnValue({
				select: mockSelect,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				insert: mockInsert,
			});

			const result = await createPlatform(mockPlatform);

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockInsert).toHaveBeenCalledWith(mockPlatform);
			expect(result).toEqual(mockPlatformResponse);
		});

		it("should handle RLS policy errors when unauthenticated", async () => {
			const authError = { message: "Not authorized", code: "42501" };
			const mockSelect = jest.fn().mockReturnValue({
				single: jest.fn().mockResolvedValue({
					data: null,
					error: authError,
				}),
			});

			const mockInsert = jest.fn().mockReturnValue({
				select: mockSelect,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				insert: mockInsert,
			});

			await expect(createPlatform(mockPlatform)).rejects.toEqual(authError);
		});
	});

	describe("UPDATE Platform - Authentication Required (via RLS)", () => {
		it("should update a platform when properly authenticated", async () => {
			const updates = { name: "Updated Platform" };

			// Mock for the select call (second call)
			const mockSelectSingle = jest.fn().mockResolvedValue({
				data: { ...mockPlatformResponse, ...updates },
				error: null,
			});

			const mockSelectEq = jest.fn().mockReturnValue({
				single: mockSelectSingle,
			});

			const mockSelect = jest.fn().mockReturnValue({
				eq: mockSelectEq,
			});

			// Mock for the update call (first call)
			const mockUpdateEq = jest.fn().mockResolvedValue({
				error: null,
			});

			const mockUpdate = jest.fn().mockReturnValue({
				eq: mockUpdateEq,
			});

			// Setup from to return different mocks on consecutive calls
			(supabase.from as jest.Mock)
				.mockReturnValueOnce({
					update: mockUpdate,
				})
				.mockReturnValueOnce({
					select: mockSelect,
				});

			const result = await updatePlatform("platform-123", updates);

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockUpdate).toHaveBeenCalledWith(updates);
			expect(mockUpdateEq).toHaveBeenCalledWith("id", "platform-123");
			expect(result.name).toBe("Updated Platform");
		});

		it("should handle RLS policy errors when unauthenticated", async () => {
			const updates = { name: "Updated Platform" };
			const authError = { message: "Not authorized", code: "42501" };

			// Mock for the update call (first call) - this should fail with auth error
			const mockUpdateEq = jest.fn().mockResolvedValue({
				error: authError,
			});

			const mockUpdate = jest.fn().mockReturnValue({
				eq: mockUpdateEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				update: mockUpdate,
			});

			await expect(updatePlatform("platform-123", updates)).rejects.toEqual(
				authError
			);
		});
	});

	describe("DELETE Platform - Authentication Required (via RLS)", () => {
		it("should delete a platform when properly authenticated", async () => {
			const mockEq = jest.fn().mockResolvedValue({
				error: null,
			});

			const mockDelete = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				delete: mockDelete,
			});

			await deletePlatform("platform-123");

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockDelete).toHaveBeenCalled();
			expect(mockEq).toHaveBeenCalledWith("id", "platform-123");
		});

		it("should handle RLS policy errors when unauthenticated", async () => {
			const authError = { message: "Not authorized", code: "42501" };
			const mockEq = jest.fn().mockResolvedValue({
				error: authError,
			});

			const mockDelete = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				delete: mockDelete,
			});

			await expect(deletePlatform("platform-123")).rejects.toEqual(authError);
		});
	});

	describe("VIEW Platforms - No Authentication Required", () => {
		it("should allow unauthenticated users to get all published platforms", async () => {
			const mockOrder2 = jest.fn().mockResolvedValue({
				data: [mockPlatformResponse],
				error: null,
			});

			const mockOrder1 = jest.fn().mockReturnValue({
				order: mockOrder2,
			});

			const mockEq = jest.fn().mockReturnValue({
				order: mockOrder1,
			});

			const mockSelect = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				select: mockSelect,
			});

			const result = await getPublishedPlatforms();

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockSelect).toHaveBeenCalled();
			expect(mockEq).toHaveBeenCalledWith("is_published", true);
			expect(result).toEqual([mockPlatformResponse]);
			// No authentication check should be made
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});

		it("should allow unauthenticated users to get platform by slug", async () => {
			const mockPlatformWithArticle = {
				...mockPlatformResponse,
				articles: [{ id: "article-123", title: "Test Article" }],
			};

			const mockSingle = jest.fn().mockResolvedValue({
				data: mockPlatformWithArticle,
				error: null,
			});

			const mockEq2 = jest.fn().mockReturnValue({
				single: mockSingle,
			});

			const mockEq1 = jest.fn().mockReturnValue({
				eq: mockEq2,
			});

			const mockSelect = jest.fn().mockReturnValue({
				eq: mockEq1,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				select: mockSelect,
			});

			const result = await getPlatformBySlug("test-platform");

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockEq1).toHaveBeenCalledWith("slug", "test-platform");
			expect(mockEq2).toHaveBeenCalledWith("is_published", true);
			expect(result).toBeDefined();
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});

		it("should allow unauthenticated users to view all platforms (admin view requires auth via other means)", async () => {
			const mockOrder2 = jest.fn().mockResolvedValue({
				data: [mockPlatformResponse],
				error: null,
			});

			const mockOrder1 = jest.fn().mockReturnValue({
				order: mockOrder2,
			});

			const mockSelect = jest.fn().mockReturnValue({
				order: mockOrder1,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				select: mockSelect,
			});

			const result = await getAllPlatforms();

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(result).toEqual([mockPlatformResponse]);
			// Note: The function itself doesn't check auth, but UI/middleware would
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});
	});

	describe("TOGGLE Platform Publish - Authentication Required (via RLS)", () => {
		it("should toggle publish status when authenticated", async () => {
			// Mock fetching current status
			const mockSingleForFetch = jest.fn().mockResolvedValue({
				data: { is_published: false },
				error: null,
			});

			const mockEqForFetch = jest.fn().mockReturnValue({
				single: mockSingleForFetch,
			});

			const mockSelectForFetch = jest.fn().mockReturnValue({
				eq: mockEqForFetch,
			});

			// Mock update operation
			const mockSingleForUpdate = jest.fn().mockResolvedValue({
				data: { ...mockPlatformResponse, is_published: true },
				error: null,
			});

			const mockSelectForUpdate = jest.fn().mockReturnValue({
				single: mockSingleForUpdate,
			});

			const mockEqForUpdate = jest.fn().mockReturnValue({
				select: mockSelectForUpdate,
			});

			const mockUpdate = jest.fn().mockReturnValue({
				eq: mockEqForUpdate,
			});

			// Setup the mock to return different values based on call order
			let callCount = 0;
			(supabase.from as jest.Mock).mockImplementation(() => {
				callCount++;
				if (callCount === 1) {
					return { select: mockSelectForFetch };
				} else {
					return { update: mockUpdate };
				}
			});

			const result = await togglePlatformPublish("platform-123");

			expect(result.is_published).toBe(true);
		});
	});

	describe("Admin Platform View - Protected Route (not API level)", () => {
		it("should allow fetching unpublished platforms via admin endpoint", async () => {
			const unpublishedPlatform = {
				...mockPlatformResponse,
				is_published: false,
			};
			const mockPlatformWithArticle = {
				...unpublishedPlatform,
				articles: [],
			};

			const mockSingle = jest.fn().mockResolvedValue({
				data: mockPlatformWithArticle,
				error: null,
			});

			const mockEq = jest.fn().mockReturnValue({
				single: mockSingle,
			});

			const mockSelect = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				select: mockSelect,
			});

			const result = await getPlatformBySlugAdmin("test-platform");

			expect(supabase.from).toHaveBeenCalledWith("platforms");
			expect(mockEq).toHaveBeenCalledWith("slug", "test-platform");
			expect(result).toBeDefined();
			// Note: Auth is handled at route/middleware level, not in this function
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});
	});
});
