<template>
  <Head>
    <Title>SMS - Dashboard</Title>
  </Head>
  <Dashboard>
    <div class="grid xl:grid-cols-4 lg:grid-cols-2 gap-2">
      <div
        class="border border-gray-300 shadow-sm rounded-md p-4"
        v-for="(pack, i) in packages"
        :key="i"
      >
        <h3 class="text-slate-900 text-2xl font-bold mb-3">
          {{ pack.name }} {{ pack.bonus ? `+ extra ${pack.bonus}` : "" }}
        </h3>
        <h3 class="text-slate-900 text-lg font-semibold">
          ৳{{ pack.price
          }}<span class="text-slate-600 text-sm font-normal">/per month</span>
        </h3>

        <div class="mt-6">
          <ul class="mt-8 space-y-4">
            <li
              class="flex items-center text-[15px] text-slate-600 font-medium"
              v-for="(feature, k) in pack.features"
              :key="`k${k}`"
            >
              <CircleCheckBigIcon class="mr-2 stroke-green-500" />
              {{ feature }}
            </li>
          </ul>

          <Button type="button" class="w-full mt-5" @click="purchase(pack)">
            Purchase SMS
          </Button>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script>
import { CircleCheckBigIcon } from "lucide-vue-next";

export default {
  name: "SMS",
  components: { CircleCheckBigIcon },
  data() {
    return {
      packages: [
        {
          id: "1",
          name: "500 SMS",
          price: 299,
          sms: 500,
          bonus: 0,
          features: [
            "All Operator Support",
            "Real-Time Report",
            "Single, Bulk & Custom SMS",
            "Validity: 1 month",
          ],
        },
        {
          id: "2",
          name: "1000 SMS",
          price: 599,
          sms: 1000,
          bonus: 0,
          features: [
            "All Operator Support",
            "Real-Time Report",
            "Single, Bulk & Custom SMS",
            "Validity: 1 month",
          ],
        },
        {
          id: "3",
          name: "2000 SMS",
          price: 1199,
          sms: 2000,
          bonus: 200,
          features: [
            "All Operator Support",
            "Real-Time Report",
            "Single, Bulk & Custom SMS",
            "Validity: 1 month",
          ],
        },
        {
          id: "4",
          name: "5000 SMS",
          price: 2999,
          sms: 5000,
          bonus: 500,
          features: [
            "All Operator Support",
            "Real-Time Report",
            "Single, Bulk & Custom SMS",
            "Validity: 1 month",
          ],
        },
      ],
    };
  },
  methods: {
    async purchase(pack) {
      try {
        const { url } = await this.$api.post("/dashboard/payment/purchase", {
          packID: pack.id,
        });
        window.location.href = url;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
