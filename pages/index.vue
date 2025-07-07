<template>
  <Head>
    <Title>Login - Smart ISP </Title>
  </Head>
  <div
    class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex items-center gap-2 self-center font-medium">
        <img src="/logo.png" class="max-h-20" />
      </div>
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl"> Welcome to Smart ISP </CardTitle>
            <CardDescription> Login with your id and password </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="login">
              <div class="grid gap-6">
                <div class="grid gap-6">
                  <div class="grid gap-2">
                    <Label for="userid">User ID</Label>
                    <Input
                      id="userid"
                      type="text"
                      placeholder="User ID"
                      required
                      v-model="form.id"
                    />
                  </div>
                  <div class="grid gap-2">
                    <div class="flex items-center">
                      <Label for="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                      v-model="form.password"
                    />
                    <ErrorMessage name="id" :error="errors" />
                  </div>
                  <Button type="submit" class="w-full" :disabled="loading">
                    <Loader2Icon class="animate-spin" v-if="loading" /> Login
                  </Button>
                </div>
                <div class="text-center text-sm">
                  Don't have an account?
                  <a
                    href="https://wa.me/+8801728293635"
                    target="_blank"
                    class="underline underline-offset-4"
                  >
                    WhatsApp us
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { Loader2Icon, ReceiptTextIcon } from "lucide-vue-next";

export default {
  name: "IndexPage",
  components: { ReceiptTextIcon, Loader2Icon },
  data() {
    return {
      form: {
        id: "",
        password: "",
      },
      errors: {},
      loading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        const { token } = await this.$api.post("/auth/login", this.form);
        if (token) {
          const { login } = useAuth();
          const user = await login(this.form, token);
          this.$router.push(user.isAdmin ? "/admin" : "/dashboard");
        }
      } catch (error) {
        console.error(error);
        if (error?.response?._data?.errors) {
          this.errors = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
