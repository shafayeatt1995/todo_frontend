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
      <div class="flex justify-center flex-col items-center gap-2">
        <div class="w-full h-1 bg-gray-200 rounded-full">
          <div
            class="h-1 bg-black rounded-full transition-all duration-15000 ease-in-out"
            :class="loading ? 'w-full' : 'w-0'"
          ></div>
        </div>
        <p class="text-gray-700 text-center" @click="init()">
          Don't close the browser. We are verifying your payment and updating
          your profile.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "paymentSuccess",
  data() {
    return {
      loading: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      try {
        if (this.$refs.loadingRef) {
          const { initLottie } = useUtils();
          await initLottie(
            this.$refs.loadingRef,
            "/lottie/payment-success.json",
            false
          );
        }
        this.loading = true;
        const { paymentID, signature } = this.$route.query;
        await this.$api.post("/webhook/bkash/verify-payment", {
          paymentID,
          signature,
        });
        window.location.href = "/dashboard";
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
