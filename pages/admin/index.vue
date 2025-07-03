<template>
  <Admin>
    <pre>{{ authUser }}</pre>
  </Admin>
</template>

<script>
export default {
  name: "Admin",
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
};
</script>
