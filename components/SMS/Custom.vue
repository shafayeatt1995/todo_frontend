<template>
  <Card class="py-4 px-2">
    <CardHeader class="p-0">
      <CardTitle>Custom SMS</CardTitle>
    </CardHeader>
    <CardContent class="space-y-2 p-0">
      <div class="space-y-1">
        <Label for="name">Message</Label>
        <Textarea v-model="form.message" placeholder="Enter your message" />
      </div>
      <div class="space-y-1">
        <Label for="type">Select Type</Label>
        <Select v-model="form.type">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="zone">Select Zone</SelectItem>
            <SelectItem value="customer">Select Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <template v-if="form.type === 'zone'">
        <div class="space-y-1">
          <Label for="zone">Select Zone</Label>
          <Select v-model="form.zone" multiple>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                :value="zone._id"
                v-for="zone in zones"
                :key="zone._id"
              >
                {{ zone.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-1">
          <Label for="zone">Select Sub Zone</Label>
          <Select v-model="form.subZone" multiple>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a sub zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="zone">Select Zone</SelectItem>
              <SelectItem value="customer">Select Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </template>
    </CardContent>
    <CardFooter class="flex justify-end">
      <Button>Send Message</Button>
    </CardFooter>
  </Card>
</template>

<script>
export default {
  name: "SMSCustom",
  data() {
    return {
      form: {
        message: "",
        type: "all",
        zone: "",
        subZone: "",
      },
      zones: [],
    };
  },
  watch: {
    "form.type"(val) {
      if (val === "zone") {
        this.fetchZone();
      }
    },
  },
  methods: {
    async fetchZone() {
      try {
        const { zones } = await this.$api.get("/dashboard/sms/zone");
        this.zones = zones;
      } catch (err) {}
    },
  },
};
</script>
