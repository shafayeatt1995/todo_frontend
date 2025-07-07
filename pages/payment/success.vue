<template>
  <Head>
    <Title>Payment Success</Title>
  </Head>
  <div
    class="min-h-svh w-full flex justify-center items-center"
    style="background-image: url('/bg.svg')"
  >
    <div class="flex flex-col justify-center items-center w-full p-4">
      <div ref="loadingRef" class="max-h-72 w-full"></div>
      <div
        class="flex justify-center flex-col items-center gap-2 max-w-xl w-xl"
      >
        <div class="w-full h-1 bg-gray-200 rounded-full">
          <div
            class="h-1 bg-black rounded-full transition-all duration-15000 ease-in-out"
            :class="loading ? 'w-full' : 'w-0'"
          ></div>
        </div>
        <div v-if="failed" class="flex flex-col gap-2 items-center">
          <p class="text-gray-700 text-center">
            Payment failed. Please try again.
          </p>
          <NuxtLink
            to="/dashboard"
            :class="cn(buttonVariants({ variant: 'default' }))"
            ><ChevronLeftIcon /> Back to dashboard</NuxtLink
          >
        </div>
        <p class="text-gray-700 text-center" v-else>
          Don't close the browser. We are verifying your payment and updating
          your profile.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { buttonVariants } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { ChevronLeftIcon } from "lucide-vue-next";

export default {
  name: "paymentSuccess",
  components: {
    ChevronLeftIcon,
  },
  data() {
    return {
      loading: false,
      failed: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    cn,
    buttonVariants,
    async init() {
      const { initLottie } = useUtils();
      try {
        if (this.$refs.loadingRef) {
          await initLottie(
            this.$refs.loadingRef,
            "/lottie/payment-success.json",
            false
          );
        }
        this.loading = true;
        const { paymentID } = this.$route.query;
        await this.$api.post("/webhook/bkash/verify-payment", { paymentID });
        window.location.href = "/dashboard";
      } catch (error) {
        console.error(error);
        if (this.$refs.loadingRef) {
          this.$refs.loadingRef.innerHTML = "";
          await initLottie(
            this.$refs.loadingRef,
            "/lottie/payment-failed.json",
            false
          );
        }
        this.failed = true;
        this.loading = false;
      }
    },
  },
};
</script>
