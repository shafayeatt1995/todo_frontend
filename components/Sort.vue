<template>
  <div class="flex flex-col" v-if="value">
    <ChevronUpIcon :size="12" :class="value == 1 ? 'text-primary' : ''" />
    <ChevronDownIcon
      :size="12"
      class="-mt-1"
      :class="value == -1 ? 'text-primary' : ''"
    />
  </div>
</template>

<script>
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
export default {
  name: "Sort",
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
  },
};
</script>
