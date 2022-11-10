import { User } from "@prisma/client";
import moment from "moment";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { useAxiosError } from "~~/composables/useAxiosError";
import { api } from "~~/service/api";
import { useLoading } from "./loading";

type AuthStoreProps = {
  token?: string;
  expires_at?: null | Date;
  user?: null | User;
};

export const useAuthStore = defineStore("auth", {
  state(): AuthStoreProps {
    return {
      token: null,
      expires_at: null,
      user: null,
    };
  },
  actions: {
    async signIn({ email, password }: { email: string; password: string }) {
      const loading = useLoading();
      const router = useRouter();

      loading.hint = "Signing...";
      loading.open();

      try {
        const result = await api.post("/auth/sign-in", {
          email,
          password,
        });

        this.token = result.data.token;
        this.user = result.data.user;
        this.expires_at = moment().add(24, "h");

        router.push("/dashboard");
        loading.close();
      } catch (error) {
        useAxiosError(error, () => {
          loading.close();
          window.location.reload();
        });
      }
    },
    async signUp({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) {
      const loading = useLoading();
      const router = useRouter();

      loading.hint = "Creating account...";
      loading.open();

      try {
        const result = await api.post("/auth/sign-up", {
          email,
          password,
          name,
        });

        this.token = result.data.token;
        this.user = result.data.user;
        this.expires_at = result.data.expires_at;

        router.push("/dashboard");
        loading.close();
      } catch (error) {
        useAxiosError(error, () => {
          loading.close();
          window.location.reload();
        });
      }
    },
    async signOut() {
      const router = useRouter();

      this.token = null;
      this.user = null;
      this.expires_at = null;

      router.push("/auth/sign-in");
    },
    async forgotPassword({ email }: { email: string }) {
      const loading = useLoading();
      const router = useRouter();

      loading.hint = "Sending a reset email...";
      loading.open();

      try {
        const result = await api.post("/auth/forgot-password", {
          email,
        });

        Swal.fire({
          icon: "success",
          title: result.data.message,
          showCancelButton: true,
          cancelButtonText: "OK",
        });
        router.push("/auth/next-step-forgot-password");
        loading.close();
      } catch (error) {
        useAxiosError(error, () => {
          loading.close();
          window.location.reload();
        });
      }
    },
    async resetPassword({
      resetPasswordToken,
      password,
    }: {
      resetPasswordToken: string;
      password: string;
    }) {
      const loading = useLoading();
      const router = useRouter();

      loading.hint = "Reseting password...";
      loading.open();

      try {
        const result = await api.post("/auth/reset-password", {
          token: resetPasswordToken,
          password,
        });

        Swal.fire({
          icon: "success",
          title: result.data.message,
          showCancelButton: true,
          cancelButtonText: "OK",
        });

        loading.close();
        router.push("/auth/sign-in");
      } catch (error) {
        useAxiosError(error, () => {
          loading.close();
          window.location.reload();
        });
      }
    },
  },
  persist: true,
});
