<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script>
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";

export default {
  name: "App",
  components: { Toaster },
};
</script>
