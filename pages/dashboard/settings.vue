<template>
  <Head>
    <Title>Settings - Dashboard</Title>
  </Head>
  <Dashboard>
    <Tabs :defaultValue="selectTab" class="w-full overflow-hidden">
      <div class="w-full overflow-x-auto whitespace-nowrap">
        <TabsList class="w-full flex gap-2 min-w-max">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            >{{ tab.label }}</TabsTrigger
          >
        </TabsList>
      </div>
      <TabsContent value="notification">
        <Card class="py-4 px-2">
          <CardHeader class="p-0">
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 p-0">
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
          </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle> Profile Settings </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2"> </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle> Payment Settings </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2"> </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
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
      selectTab: "notification",
      tabs: [
        { value: "notification", label: "Notification" },
        { value: "profile", label: "Profile" },
        { value: "payment", label: "Payment" },
      ],
      connectLoading: false,
      checkLoading: false,
    };
  },
  watch: {
    selectTab(val) {
      console.log(val);
      this.$router.push({
        query: {
          ...this.$route.query,
          activeTab: val,
        },
      });
    },
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
