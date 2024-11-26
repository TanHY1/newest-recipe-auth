import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    errors: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/signup`, { email, password, name });
            set ({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error?.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },
    
	verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
		try {
            const response = await axios.post(`/api/auth/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            console.log('Checking auth...'); // Debug log
            const response = await axios.get(`/api/auth/check-auth`, {
                withCredentials: true
            });
            console.log('Auth response:', response); // Debug log
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            console.error('Auth check error:', error.response || error); // Detailed error log
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null});
    try {
        await axios.post(`/api/auth/logout`);
        set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
        set({ error: "Failed to logout", isLoading: false });
        throw error;
    }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error resetting password", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`/api/auth/reset-password/${token}`, {password});
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ 
                isLoading: false, 
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },

    setUser: (user) => { //Add function to update user state
        set({ user });
    },

    uploadProfilePicture: async (file) => {
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await axios.post('/api/auth/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            set((state) => ({
                user: {
                    ...state.user,
                    profilePicture: response.data.filename,
                }
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error uploading profile picture";
            throw new Error(errorMessage);
        }
    },
}));