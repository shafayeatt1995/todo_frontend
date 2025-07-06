<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent"
        v-if="authUser"
      >
        <img
          :src="authUser?.business?.image?.url"
          class="size-10 object-contain"
        />
        <div class="grid flex-1 text-left text-sm leading-tight">
          <p class="truncate font-semibold">
            {{ authUser?.business?.name }}
          </p>
          <p class="flex items-center gap-1 text-xs">
            <span class="truncate" v-if="expDate > 0">
              {{ $normalDate(authUser?.business?.exp) }}
            </span>
            <span v-else>(Expired)</span>
            <span v-if="authUser?.business?.sms >= 0"
              >(SMS: {{ authUser?.business?.sms }})</span
            >
          </p>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script>
import { ChevronsUpDown } from "lucide-vue-next";
import { useSidebar } from "@/components/ui/sidebar/utils";

export default {
  name: "TeamSwitcher",
  components: {
    ChevronsUpDown,
  },
  computed: {
    isMobile() {
      const { isMobile } = useSidebar();
      return isMobile.value;
    },
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
    expDate() {
      const exp = new Date(this.authUser?.business?.exp);
      const today = new Date();
      const diffTime = exp - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
  },
};
</script>
