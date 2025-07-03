<template>
  <Head>
    <Title>Dashboard</Title>
  </Head>
  <Dashboard>
    <h1>Dashboard</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5">
      <NuxtLink
        to="/dashboard/complain"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-amber-50 border-amber-300 border aspect-square text-amber-500"
      >
        <BookOpenTextIcon :size="100" />
        <p class="text-xl font-bold text-center">Complain</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/contact"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-blue-50 border-blue-300 border aspect-square text-blue-500"
      >
        <ContactIcon :size="100" />
        <p class="text-xl font-bold text-center">Contact</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/package"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-green-50 border-green-300 border aspect-square text-green-500"
      >
        <PackageIcon :size="100" />
        <p class="text-xl font-bold text-center">Package</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/user"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-rose-50 border-rose-300 border aspect-square text-rose-500"
      >
        <UserIcon :size="100" />
        <p class="text-xl font-bold text-center">User</p>
      </NuxtLink>
    </div>
  </Dashboard>
</template>

<script>
import {
  BookOpenTextIcon,
  ContactIcon,
  PackageIcon,
  UserIcon,
} from "lucide-vue-next";
export default {
  name: "Dashboard",
  components: {
    BookOpenTextIcon,
    ContactIcon,
    PackageIcon,
    UserIcon,
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
};
</script>
