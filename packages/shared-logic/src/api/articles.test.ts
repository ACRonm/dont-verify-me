import {
	createArticle,
	updateArticle,
	deleteArticle,
	getArticleById,
	getAllArticles,
	getArticleByPlatformId,
	toggleArticlePublish,
	type Article,
} from './articles';
import { supabase } from './supabase';

// Mock the supabase module
jest.mock('./supabase', () => ({
	supabase: {
		auth: {
			getUser: jest.fn(),
		},
		from: jest.fn(),
	},
}));

describe('Articles API - Authentication Tests', () => {
	const mockArticle: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'author_id'> = {
		platform_id: 'platform-123',
		title: 'Test Article',
		slug: 'test-article',
		content: 'Test content',
		is_published: false,
	};

	const mockArticleResponse: Article = {
		id: 'article-123',
		platform_id: 'platform-123',
		title: 'Test Article',
		slug: 'test-article',
		content: 'Test content',
		is_published: false,
		created_at: '2025-01-01T00:00:00.000Z',
		updated_at: '2025-01-01T00:00:00.000Z',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('CREATE Article - Authentication Required', () => {
		it('should create an article when user is authenticated', async () => {
			// Mock authenticated user
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			(supabase.auth.getUser as jest.Mock).mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the insert operation
			const mockSelect = jest.fn().mockReturnValue({
				single: jest.fn().mockResolvedValue({
					data: { ...mockArticleResponse, author_id: mockUser.id },
					error: null,
				}),
			});

			const mockInsert = jest.fn().mockReturnValue({
				select: mockSelect,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				insert: mockInsert,
			});

			const result = await createArticle(mockArticle);

			expect(supabase.auth.getUser).toHaveBeenCalled();
			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockInsert).toHaveBeenCalledWith({
				...mockArticle,
				author_id: mockUser.id,
			});
			expect(result.author_id).toBe(mockUser.id);
		});

		it('should throw an error when user is NOT authenticated', async () => {
			// Mock unauthenticated user
			(supabase.auth.getUser as jest.Mock).mockResolvedValue({
				data: { user: null },
				error: null,
			});

			await expect(createArticle(mockArticle)).rejects.toThrow('Not authenticated');
			expect(supabase.auth.getUser).toHaveBeenCalled();
		});
	});

	describe('UPDATE Article - Authentication Required', () => {
		it('should update an article when user is authenticated', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			(supabase.auth.getUser as jest.Mock).mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			const updates = { title: 'Updated Title' };

			const mockSelect = jest.fn().mockReturnValue({
				single: jest.fn().mockResolvedValue({
					data: { ...mockArticleResponse, ...updates, author_id: mockUser.id },
					error: null,
				}),
			});

			const mockEq = jest.fn().mockReturnValue({
				select: mockSelect,
			});

			const mockUpdate = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				update: mockUpdate,
			});

			const result = await updateArticle('article-123', updates);

			expect(supabase.auth.getUser).toHaveBeenCalled();
			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockUpdate).toHaveBeenCalledWith({
				...updates,
				author_id: mockUser.id,
			});
			expect(mockEq).toHaveBeenCalledWith('id', 'article-123');
		});

		it('should throw an error when user is NOT authenticated', async () => {
			(supabase.auth.getUser as jest.Mock).mockResolvedValue({
				data: { user: null },
				error: null,
			});

			await expect(updateArticle('article-123', { title: 'Updated' })).rejects.toThrow(
				'Not authenticated'
			);
			expect(supabase.auth.getUser).toHaveBeenCalled();
		});
	});

	describe('DELETE Article - Authentication Required (via RLS)', () => {
		it('should attempt to delete an article (RLS enforces authentication)', async () => {
			const mockEq = jest.fn().mockResolvedValue({
				error: null,
			});

			const mockDelete = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				delete: mockDelete,
			});

			await deleteArticle('article-123');

			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockDelete).toHaveBeenCalled();
			expect(mockEq).toHaveBeenCalledWith('id', 'article-123');
		});

		it('should handle deletion errors (e.g., RLS policy blocks unauthenticated users)', async () => {
			const authError = { message: 'Not authorized', code: '42501' };
			const mockEq = jest.fn().mockResolvedValue({
				error: authError,
			});

			const mockDelete = jest.fn().mockReturnValue({
				eq: mockEq,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				delete: mockDelete,
			});

			await expect(deleteArticle('article-123')).rejects.toEqual(authError);
		});
	});

	describe('VIEW Articles - No Authentication Required', () => {
		it('should allow unauthenticated users to get all articles', async () => {
			const mockOrder = jest.fn().mockResolvedValue({
				data: [mockArticleResponse],
				error: null,
			});

			const mockSelect = jest.fn().mockReturnValue({
				order: mockOrder,
			});

			(supabase.from as jest.Mock).mockReturnValue({
				select: mockSelect,
			});

			const result = await getAllArticles();

			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockSelect).toHaveBeenCalled();
			expect(result).toEqual([mockArticleResponse]);
			// Note: No auth.getUser() call should be made
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});

		it('should allow unauthenticated users to get article by ID', async () => {
			const mockSingle = jest.fn().mockResolvedValue({
				data: mockArticleResponse,
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

			const result = await getArticleById('article-123');

			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockEq).toHaveBeenCalledWith('id', 'article-123');
			expect(result).toEqual(mockArticleResponse);
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});

		it('should allow unauthenticated users to get article by platform ID', async () => {
			const mockSingle = jest.fn().mockResolvedValue({
				data: mockArticleResponse,
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

			const result = await getArticleByPlatformId('platform-123');

			expect(supabase.from).toHaveBeenCalledWith('articles');
			expect(mockEq).toHaveBeenCalledWith('platform_id', 'platform-123');
			expect(result).toEqual(mockArticleResponse);
			expect(supabase.auth.getUser).not.toHaveBeenCalled();
		});
	});

	describe('TOGGLE Article Publish - Authentication Required', () => {
		it('should toggle publish status when user is authenticated', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			(supabase.auth.getUser as jest.Mock).mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

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
				data: { ...mockArticleResponse, is_published: true, author_id: mockUser.id },
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

			const result = await toggleArticlePublish('article-123');

			expect(supabase.auth.getUser).toHaveBeenCalled();
			expect(result.is_published).toBe(true);
		});
	});
});
