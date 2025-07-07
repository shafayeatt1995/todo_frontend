<template>
  <p class="text-3xl text-center" @click="check">AMi anik</p>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster richColors />
</template>

<script>
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";

export default {
  name: "App",
  components: { Toaster },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.authUser) this.checkToken();
    }, 3000);
  },
  methods: {
    async cleanImage() {
      try {
        await this.$api.get("/dashboard/clean-image");
      } catch (error) {
        console.error(error);
      }
    },
    async checkToken() {
      try {
        if (!this.authUser) return;
        const { getCookie, decode } = useUtils();
        const token = getCookie("sessionToken");

        if (!token) {
          console.log("No sessionToken found");
          return;
        }
        const parts = token.split(".");
        if (parts.length !== 3) {
          console.log("Invalid JWT format");
          return;
        }

        const payload = JSON.parse(decode(parts[1]));
        const exp = payload.exp;
        const now = Date.now();
        const expMs = exp * 1000;
        const diffMs = expMs - now;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        console.log("JWT expires in:", Math.round(diffDays), "days");

        if (diffDays <= 2) {
          const { refreshToken } = useAuth();
          await refreshToken();
        }
      } catch (e) {
        console.log("Error parsing JWT:", e);
      }
    },
  },
};
</script>
