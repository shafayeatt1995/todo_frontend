<script setup>
import { CollapsibleRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps({
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
});
const emits = defineEmits(["update:open"]);

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <CollapsibleRoot v-slot="{ open }" data-slot="collapsible" v-bind="forwarded">
    <slot :open="open" />
  </CollapsibleRoot>
</template>
