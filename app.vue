<template>
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
  mounted() {
    // setTimeout(() => {
    //   this.cleanImage();
    // }, 3000);
  },
  methods: {
    async cleanImage() {
      try {
        await this.$api.get("/dashboard/clean-image");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
