<template>
  <div
    class="rounded-full size-8 border border-black flex justify-center items-center cursor-pointer"
    @click="connect"
  >
    <BellIcon />
  </div>
</template>

<script>
import { BellIcon } from "lucide-vue-next";

export default {
  name: "ConnectNotification",
  components: { BellIcon },
  methods: {
    async connect() {
      try {
        const { requestPermission, listenForeground } = useNotifications();
        const token = await requestPermission();
        await this.$api.post("/dashboard/add-fcm", { token });

        listenForeground(); // optional
      } catch (err) {
        console.error("❌ Notification setup failed:", err);
        alert("Notification permission denied.");
      }
    },
  },
};
</script>
