<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <AdminTeamSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <AdminNavMain />
      <!-- <NavProjects /> -->
    </SidebarContent>
    <SidebarFooter>
      <AdminNavUser />
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
