<template>
  <LayoutDashboard>
    <div class="p-2">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>
      <div class="flex justify-between items-center">
        <p>Connect Notification</p>
        <Button @click="connect"> Connect </Button>
      </div>
      <div class="flex justify-between items-center">
        <p>Check Notification</p>
        <Button @click="check">
          <BellIcon />
        </Button>
      </div>
    </div>
  </LayoutDashboard>
</template>

<script>
import { BellIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "ConnectNotification",
  components: { BellIcon },
  methods: {
    async connect() {
      try {
        const { requestPermission, listenForeground } = useNotifications();
        const token = await requestPermission();
        await this.$api.post("/dashboard/add-fcm", { token });
        listenForeground();
        toast.success("Notification connected successfully.");
      } catch (err) {
        console.error("❌ Notification setup failed:", err);
        toast.error("Notification permission denied.");
      }
    },
    async check() {
      try {
        await this.$api.get("/dashboard/check-fcm");
        toast.success("Notification checked successfully.");
      } catch (err) {
        console.error("❌ Notification check failed:", err);
        toast.error("Notification check failed.");
      }
    },
  },
};
</script>
