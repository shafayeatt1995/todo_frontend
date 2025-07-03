<template>
  <SidebarProvider>
    <DashboardAppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between px-2 border-b shadow-xs sticky top-0 z-10 backdrop-blur-sm"
      >
        <div class="flex items-center gap-2 px-0 lg:px-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
        </div>
        <img
          :src="authUser?.business?.image?.url"
          v-if="authUser"
          class="size-16 object-contain"
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/1.webp" alt="user" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="logout">
              <LogOutIcon /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div class="py-4 px-2 lg:px-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script>
import { LogOutIcon } from "lucide-vue-next";

export default {
  name: "Dashboard",
  components: {
    LogOutIcon,
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
  methods: {
    async logout() {
      const { logout } = useAuth();
      await logout();
    },
  },
};
</script>
