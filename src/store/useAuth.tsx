import { create } from "zustand";
import authServices from "../services/authServices";
import { LoginT, SignupT, UserT } from "../types/types";

type UserStateT = {
  user: null | UserT;
  loading: boolean;
  error: string;
  success: boolean;
  message: string;
  setUser: (user: null | UserT) => void;
  googleAuth: () => void;
  login: (payload: LoginT) => void;
  signup: (payload: SignupT) => void;
  sendPasswordResetLink: (email: string) => void;
  resetPassword: (password: string) => void;
  logout: () => void;
  resetAuth: () => void;
};

const savedUser: string | null = localStorage.getItem("user");
const parsedUser: UserT | undefined = savedUser
  ? JSON.parse(savedUser)
  : undefined;

const useAuth = create<UserStateT>((set) => ({
  user: parsedUser ? parsedUser : null,
  loading: false,
  error: "",
  success: false,
  message: "",

  setUser: (user: null | UserT) => {
    set((state) => ({ user: (state.user = user) }));
  },

  googleAuth: async () => {
    try {
      const user = await authServices.googleAuth();
      set((state) => ({ user: (state.user = user) }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  login: async (payload: LoginT) => {
    set((state) => ({ loading: (state.loading = true) }));
    try {
      const user = await authServices.login(payload);
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ success: (state.success = true) }));
      set((state) => ({ user: (state.user = user) }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  signup: async (payload: SignupT) => {
    set((state) => ({ loading: (state.loading = true) }));
    try {
      await authServices.signup(payload);
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ success: (state.success = true) }));
      set((state) => ({
        message: (state.message =
          "A verification link has been sent to your email"),
      }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  sendPasswordResetLink: async (email: string) => {
    set((state) => ({ loading: (state.loading = true) }));
    try {
      await authServices.sendPasswordResetLink(email);
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ success: (state.success = true) }));
      set((state) => ({
        message: (state.message = "A reset link has been sent to your email"),
      }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  resetPassword: async (password: string) => {
    set((state) => ({ loading: (state.loading = true) }));
    try {
      await authServices.resetPassword(password);
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ success: (state.success = true) }));
      set((state) => ({
        message: (state.message =
          "Your password has been reset. Log in with your new password."),
      }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ loading: (state.loading = false) }));
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  logout: async () => {
    try {
      await authServices.logout();
      set((state) => ({ user: (state.user = null) }));
    } catch (error: any) {
      const errorMessage = error.message;
      set((state) => ({ error: (state.error = errorMessage) }));
    }
  },

  resetAuth: () => {
    set((state) => ({ loading: (state.loading = false) }));
    set((state) => ({ success: (state.success = false) }));
    set((state) => ({ error: (state.error = "") }));
    set((state) => ({ message: (state.message = "") }));
  },
}));

export default useAuth;
