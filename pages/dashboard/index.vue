<template>
  <Head>
    <Title>Dashboard</Title>
  </Head>
  <Dashboard>
    <h1 class="text-2xl font-bold text-center mb-2">Our services</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <NuxtLink
        to="/dashboard/complain"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-amber-50 border-amber-300 border aspect-square text-amber-500 rounded-xl"
      >
        <BookOpenTextIcon :size="100" />
        <p class="text-xl font-bold text-center">Complain</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/customer"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-blue-50 border-blue-300 border aspect-square text-blue-500 rounded-xl"
      >
        <ContactIcon :size="100" />
        <p class="text-xl font-bold text-center">Customer</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/sms"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-indigo-50 border-indigo-300 border aspect-square text-indigo-500 rounded-xl"
      >
        <MailCheckIcon :size="100" />
        <p class="text-xl font-bold text-center">SMS</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/user"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-rose-50 border-rose-300 border aspect-square text-rose-500 rounded-xl"
      >
        <UserIcon :size="100" />
        <p class="text-xl font-bold text-center">User</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/zone"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-cyan-50 border-cyan-300 border aspect-square text-cyan-500 rounded-xl"
      >
        <MapPinnedIcon :size="100" />
        <p class="text-xl font-bold text-center">Zone</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/sub-zone"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-green-50 border-green-300 border aspect-square text-green-500 rounded-xl"
      >
        <MapPinnedIcon :size="100" />
        <p class="text-xl font-bold text-center">Sub Zone</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/purchase"
        class="border-rounded-md p-2 flex flex-col justify-center items-center bg-green-50 border-green-300 border aspect-square text-green-500 rounded-xl"
      >
        <DollarSignIcon :size="100" />
        <p class="text-xl font-bold text-center">Purchase SMS</p>
      </NuxtLink>
    </div>
  </Dashboard>
</template>

<script>
import {
  BookOpenTextIcon,
  ContactIcon,
  DollarSignIcon,
  MailCheckIcon,
  MapPinnedIcon,
  UserIcon,
} from "lucide-vue-next";
export default {
  name: "Dashboard",
  components: {
    BookOpenTextIcon,
    ContactIcon,
    UserIcon,
    MapPinnedIcon,
    MailCheckIcon,
    DollarSignIcon,
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
};
</script>
