<template>
  <div class="flex h-svh flex-col items-center justify-center">
    <div class="w-full p-2 flex justify-between items-center border shadow">
      <img src="/logo.png" class="max-h-12" />
      <Button @click="logout"><LogOut /> logout</Button>
    </div>
    <div class="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
      <slot />
    </div>
    <div class="w-full border-t-2 flex justify-between items-center">
      <NuxtLink
        to="/dashboard"
        class="p-4 w-full text-center -mt-[2px]"
        :class="checkRoute('dashboard')"
      >
        Complain list
      </NuxtLink>
      <NuxtLink
        to="/dashboard/user"
        class="p-4 w-full text-center -mt-[2px]"
        :class="checkRoute('dashboard-user')"
        v-if="authUser.proUser"
      >
        User list
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { LogOut } from "lucide-vue-next";

export default {
  name: "Dashboard",
  components: { LogOut },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
  methods: {
    logout() {
      const { logout } = useAuth();
      logout();
    },
    checkRoute(route) {
      const { name } = this.$route;
      return name === route
        ? "border-t-2 border-sky-500"
        : " border-t-2 border-transparent";
    },
  },
};
</script>
