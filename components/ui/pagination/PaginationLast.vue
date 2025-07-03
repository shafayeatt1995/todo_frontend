<script setup>
import { reactiveOmit } from "@vueuse/core";
import { ChevronsRightIcon } from "lucide-vue-next";
import { PaginationLast, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
  size: { type: null, required: false, default: "icon" },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class", "size");
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationLast
    data-slot="pagination-last"
    :class="
      cn(
        buttonVariants({ variant: 'outline', size }),
        'gap-1 px-2.5 sm:pr-2.5',
        props.class
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <ChevronsRightIcon />
    </slot>
  </PaginationLast>
</template>
