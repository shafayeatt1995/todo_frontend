<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        v-if="authUser"
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage src="/1.webp" :alt="authUser.name" />
          <AvatarFallback class="rounded-lg">
            {{ authUser.name.charAt(0).toUpperCase() }}
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ authUser.name }}</span>
          <span class="truncate text-xs">{{ authUser.type }}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script>
import { useSidebar } from "@/components/ui/sidebar/utils";

export default {
  name: "NavUser",
  computed: {
    isMobile() {
      const { isMobile } = useSidebar();
      return isMobile.value;
    },
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
};
</script>
