import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '../api/supabase';
import { useToastController } from '@tamagui/toast';
import { useRouter } from 'next/navigation';

// Mock Supabase
jest.mock('../api/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Mock Tamagui toast
const mockToastController = {
  show: jest.fn(),
};

jest.mock('@tamagui/toast', () => ({
  useToastController: jest.fn(() => mockToastController),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    refresh: jest.fn(),
  })),
}));

describe('useAuth', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock getSession to return no session by default for initial render
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  it('should initialize with loading true and fetch session on mount', async () => {
    // Mock getSession to return no session
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();

    // Wait for the async effect to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After loading, session and user should still be null as per mock
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
  });

  it('should update session and user if getSession returns a session', async () => {
    const mockSession = {
      access_token: 'mock_access_token',
      token_type: 'Bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'mock_refresh_token',
      user: {
        id: 'mock_user_id',
        aud: 'authenticated',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
        identities: [],
      },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockSession.user);
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
  });

  it('should handle successful signInWithEmail', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      identities: [],
    };
    const mockSession = {
      access_token: 'token',
      token_type: 'Bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'refresh_token',
      user: mockUser,
    };

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    // Ensure initial loading is false after initial session check
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Call signInWithEmail
    const email = 'test@example.com';
    const password = 'password123';
    let signInPromise: Promise<any>;

    act(() => {
      signInPromise = result.current.signInWithEmail(email, password);
    });

    // Expect signInLoading to be true immediately after the call
    expect(result.current.signInLoading).toBe(true);

    // Wait for the sign-in promise to resolve and state updates to flush
    await act(async () => {
      await signInPromise;
    });

    // Expect signInLoading to be false after resolution
    expect(result.current.signInLoading).toBe(false);

    // Verify Supabase call
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });

    // Verify toast message
    expect(mockToastController.show).toHaveBeenCalledWith('Login Successful', {
      message: 'You have been successfully logged in!',
      type: 'success',
    });

    // Verify return value
    expect(await signInPromise).toEqual({ success: true, message: 'Login successful!' });
  });

  it('should handle signInWithEmail error', async () => {
    const mockError = new Error('Invalid login credentials');
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const email = 'test@example.com';
    const password = 'wrongpassword';
    let signInPromise: Promise<any>;

    act(() => {
      signInPromise = result.current.signInWithEmail(email, password);
    });

    expect(result.current.signInLoading).toBe(true);

    await act(async () => {
      await signInPromise;
    });

    expect(result.current.signInLoading).toBe(false);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });

    expect(mockToastController.show).toHaveBeenCalledWith('Login Failed', {
      type: 'error',
    });

    expect(await signInPromise).toEqual({ success: false, message: mockError.message });
  });

  it('should handle successful signUpWithEmail (confirmation email sent)', async () => {
    const mockUser = {
      id: 'user456',
      email: 'newuser@example.com',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      identities: [],
    };

    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: null }, // No session means confirmation email sent
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const email = 'newuser@example.com';
    const password = 'newpassword123';
    let signUpPromise: Promise<any>;

    act(() => {
      signUpPromise = result.current.signUpWithEmail(email, password);
    });

    expect(result.current.signUpLoading).toBe(true);

    await act(async () => {
      await signUpPromise;
    });

    expect(result.current.signUpLoading).toBe(false);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });

    expect(mockToastController.show).toHaveBeenCalledWith('Confirmation Email Sent', {
      message:
        'Please check your email for a confirmation link. If you already have an account, please sign in.',
      type: 'info',
    });

    expect(await signUpPromise).toEqual({
      success: true,
      message:
        'Please check your email for a confirmation link. If you already have an account, please sign in.',
    });
  });

  it('should handle successful signUpWithEmail (immediate login)', async () => {
    const mockUser = {
      id: 'user789',
      email: 'anotheruser@example.com',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      identities: [],
    };
    const mockSession = {
      access_token: 'token_signup',
      token_type: 'Bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'refresh_token_signup',
      user: mockUser,
    };

    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession }, // Session means immediate login
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const email = 'anotheruser@example.com';
    const password = 'anotherpassword123';
    let signUpPromise: Promise<any>;

    act(() => {
      signUpPromise = result.current.signUpWithEmail(email, password);
    });

    expect(result.current.signUpLoading).toBe(true);

    await act(async () => {
      await signUpPromise;
    });

    expect(result.current.signUpLoading).toBe(false);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });

    expect(mockToastController.show).toHaveBeenCalledWith('Signup Successful', {
      message: 'You have been successfully signed up and logged in!',
      type: 'success',
    });

    expect(await signUpPromise).toEqual({ success: true, message: 'Signup successful!' });
  });

  it('should handle signUpWithEmail error', async () => {
    const mockError = new Error('User already exists');
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const email = 'existing@example.com';
    const password = 'password123';
    let signUpPromise: Promise<any>;

    act(() => {
      signUpPromise = result.current.signUpWithEmail(email, password);
    });

    expect(result.current.signUpLoading).toBe(true);

    await act(async () => {
      await signUpPromise;
    });

    expect(result.current.signUpLoading).toBe(false);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
    });

    expect(mockToastController.show).toHaveBeenCalledWith('Signup Failed', {
      type: 'error',
    });

    expect(await signUpPromise).toEqual({ success: false, message: mockError.message });
  });

  it('should handle signInWithOAuth (Google)', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      data: { provider: null, url: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.signInWithGoogle();
    });

    expect(result.current.signInLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.signInLoading).toBe(false);
    });

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost/dashboard",
      }
    });
  });

  it('should handle signOut', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.signOut();
    });

    expect(result.current.signOutLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.signOutLoading).toBe(false);
    });

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});