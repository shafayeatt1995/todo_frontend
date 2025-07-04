<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in nav"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <NuxtLink :to="item.to" v-if="item.to">
            <SidebarMenuButton
              :class="activeUrl(item.to.name) ? 'bg-sidebar-accent' : ''"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </SidebarMenuButton>
          </NuxtLink>
          <template v-else>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton>
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="subItem in item.items"
                  :key="subItem.title"
                >
                  <SidebarMenuSubButton
                    as-child
                    :class="
                      activeUrl(subItem.to.name) ? 'bg-sidebar-accent' : ''
                    "
                  >
                    <NuxtLink :to="subItem.to">
                      <span>{{ subItem.title }}</span>
                    </NuxtLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </template>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>

<script>
import {
  ChevronRight,
  DollarSign,
  LayoutPanelLeft,
  MapPinned,
  Users,
} from "lucide-vue-next";

export default {
  name: "NavMain",
  components: {
    ChevronRight,
  },
  data() {
    return {
      nav: [
        {
          title: "Admin",
          icon: LayoutPanelLeft,
          to: { name: "admin" },
        },
        {
          title: "Users",
          url: "#",
          icon: Users,
          isActive: this.checkRoute("/admin/user"),
          items: [
            {
              title: "Users",
              to: { name: "admin-user" },
            },
            {
              title: "Business",
              to: { name: "admin-user-business" },
            },
          ],
        },
        {
          title: "Zone",
          icon: MapPinned,
          to: { name: "admin-zone" },
        },
      ],
    };
  },
  methods: {
    checkRoute(route) {
      return this.$route.path.startsWith(route);
    },
    activeUrl(name) {
      return this.$route.name === name;
    },
  },
};
</script>
