<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <component :is="activeTeam.logo" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
              <span class="truncate text-xs">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Teams
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(team, index) in teams"
            :key="team.name"
            class="gap-2 p-2"
            @click="select = index"
          >
            <div
              class="flex size-6 items-center justify-center rounded-sm border"
            >
              <component :is="team.logo" class="size-4 shrink-0" />
            </div>
            {{ team.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-background"
            >
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script>
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Plus,
  ChevronsUpDown,
} from "lucide-vue-next";
import { useSidebar } from "@/components/ui/sidebar/utils";

export default {
  name: "TeamSwitcher",
  components: {
    Plus,
    ChevronsUpDown,
  },
  data() {
    return {
      teams: [
        {
          name: "Birampur",
          logo: GalleryVerticalEnd,
          plan: "Enterprise",
        },
        {
          name: "Naogaon",
          logo: AudioWaveform,
          plan: "Startup",
        },
        {
          name: "Dhaka",
          logo: Command,
          plan: "Free",
        },
      ],
      select: 0,
    };
  },
  computed: {
    isMobile() {
      const { isMobile } = useSidebar();
      return isMobile.value;
    },
    activeTeam() {
      return this.teams[this.select];
    },
  },
};
</script>
