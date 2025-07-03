<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <DashboardTeamSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <DashboardNavMain />
      <!-- <NavProjects /> -->
    </SidebarContent>
    <SidebarFooter>
      <DashboardNavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
<script>
export default {
  name: "AppSidebar",
  data() {
    return {
      props: {
        collapsible: "icon",
      },
    };
  },
};
</script>
