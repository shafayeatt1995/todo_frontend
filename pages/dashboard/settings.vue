<template>
  <Dashboard>
    <div class="p-2">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>
      <div class="flex justify-between items-center mb-2">
        <p>Connect Notification</p>
        <Button @click="connect" :disabled="connectLoading">
          <Loader2Icon v-if="connectLoading" class="animate-spin" />
          Connect
        </Button>
      </div>
      <div class="flex justify-between items-center mb-2">
        <p>Check Notification</p>
        <Button @click="check" :disabled="checkLoading">
          <Loader2Icon v-if="checkLoading" class="animate-spin" />
          Check
        </Button>
      </div>
    </div>
  </Dashboard>
</template>

<script>
import { BellIcon, Loader2Icon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "ConnectNotification",
  components: { BellIcon, Loader2Icon },
  data() {
    return {
      connectLoading: false,
      checkLoading: false,
    };
  },
  methods: {
    async connect() {
      try {
        this.connectLoading = true;
        const { requestPermission, listenForeground } = useNotifications();
        const token = await requestPermission();
        await this.$api.post("/dashboard/add-fcm", { token });
        listenForeground();
        toast.success("Notification connected successfully.");
      } catch (err) {
        console.error("❌ Notification setup failed:", err);
        toast.error("Notification permission denied.");
      } finally {
        this.connectLoading = false;
      }
    },
    async check() {
      try {
        this.checkLoading = true;
        await this.$api.get("/dashboard/check-fcm");
        toast.success("Notification checked successfully.");
      } catch (err) {
        console.error("❌ Notification check failed:", err);
        toast.error("Notification check failed.");
      } finally {
        this.checkLoading = false;
      }
    },
  },
};
</script>
