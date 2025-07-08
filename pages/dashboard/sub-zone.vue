<template>
  <Head>
    <Title>Sub Zone - Admin</Title>
  </Head>
  <Dashboard>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl font-bold">
          <MapPinnedIcon /> Sub Zone
        </h1>
        <Button @click="modal = true"> <PlusIcon /> Add Sub Zone </Button>
      </div>
      <div
        class="flex flex-wrap md:grid grid-cols-2 xl:flex gap-2 items-center justify-between"
      >
        <div class="flex gap-1 items-center order-1">
          <Input
            class="max-w-28 md:max-w-52"
            placeholder="Search..."
            v-model="form.keyword"
          />
          <Select v-model="form.searchBy">
            <SelectTrigger>
              <SelectValue placeholder="Search By" class="capitalize" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Search By</SelectLabel>
              <Separator class="mb-1" />
              <SelectGroup>
                <SelectItem
                  v-for="option in searchByOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination
          v-if="init"
          v-slot="{ page }"
          :itemsPerPage="form.perPage"
          :total="total"
          :defaultPage="+form.page"
          :page="+form.page"
          class="flex-1 order-3 xl:order-2 col-span-2"
          @update:page="form.page = $event"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationFirst />
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :isActive="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
        <div
          class="flex gap-2 items-center order-2 xl:order-3 justify-self-end"
        >
          <p class="text-sm">Per Page:</p>
          <Select v-model="form.perPage">
            <SelectTrigger>
              <SelectValue placeholder="Select Per Page" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Per Page</SelectLabel>
              <Separator class="mb-1" />
              <SelectGroup>
                <SelectItem
                  v-for="option in perPageOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('zoneID')"
                >
                  <p>Zone</p>
                  <Sort :value="form.sort.zoneID" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('name')"
                >
                  <p>Name</p>
                  <Sort :value="form.sort.name" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(pack, i) in loading ? 10 : items" :key="i">
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.zone?.name }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.name }}</span>
              </TableCell>
              <TableCell class="w-14">
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <DropdownMenu v-else>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="hover:bg-transparent size-7"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="" align="end">
                    <DropdownMenuItem @click="editZone(pack)">
                      <SquarePenIcon />
                      <span>Edit zone</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="deleteZone(pack)" v-if="isOwner">
                      <Trash2Icon />
                      <span>Delete zone</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <TableRow v-if="!loading && items.length === 0">
              <TableCell :colspan="3" class="h-24 text-center">
                <div class="flex flex-col items-center justify-center py-10">
                  <BookOpenIcon :size="50" />
                  <p class="">No results found.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <Dialog v-model:open="modal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} Zone</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="name"> Zone </Label>
            <Select v-model="inputForm.zoneID">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="zone in zones"
                    :key="zone._id"
                    :value="zone._id"
                  >
                    {{ zone.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="name" :error="errors" />
          </div>
        </div>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="name"> Sub zone name </Label>
            <Input id="name" v-model="inputForm.name" />
            <ErrorMessage name="name" :error="errors" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} sub zone
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Dashboard>
</template>

<script>
import {
  MapPinnedIcon,
  BookOpenIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  SquarePenIcon,
  PlusIcon,
  PauseIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  DollarSignIcon,
} from "lucide-vue-next";

export default {
  name: "Zone",
  components: {
    ChevronDownIcon,
    BookOpenIcon,
    MoreHorizontalIcon,
    SquarePenIcon,
    PlusIcon,
    PauseIcon,
    PlayIcon,
    MapPinnedIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Loader2Icon,
    Trash2Icon,
    DollarSignIcon,
  },
  data() {
    return {
      perPageOptions: [25, 50, 100],
      searchByOptions: ["name"],
      form: {
        page: 1,
        perPage: 25,
        keyword: "",
        searchBy: "name",
        sort: { _id: -1 },
      },
      errors: {},
      items: [],
      total: 0,
      loading: true,
      init: false,
      debounceTimer: null,
      selectedItems: [],
      modal: false,
      editMode: false,
      inputForm: {
        name: "",
        zoneID: "",
      },
      submitLoading: false,
      zones: [],
    };
  },
  computed: {
    isOwner() {
      const { isOwner } = usePermission();
      return isOwner.value;
    },
  },
  watch: {
    "form.page"(val) {
      if (this.init) {
        this.updateRoute();
        this.fetchItems();
      }
    },
    "form.perPage"(val) {
      if (this.init) {
        this.updateRoute();
        this.refetch();
      }
    },
    "form.keyword"(val) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.updateRoute();
        this.refetch();
      }, 500);
    },
    "form.searchBy"(val) {
      if (this.form.keyword) {
        this.updateRoute();
        this.refetch();
      }
    },
    modal(val) {
      if (!val) this.reset();
    },
    items: {
      handler() {
        this.selectedItems = [];
      },
      deep: true,
    },
  },
  mounted() {
    this.form.page = +this.$route.query.page || 1;
    this.form.perPage = +this.$route.query.perPage || 25;
    this.form.keyword = this.$route.query.keyword || "";
    this.fetchZones();
    this.fetchItems();
  },
  methods: {
    async fetchZones() {
      try {
        const { zones } = await this.$api.post(`/dashboard/sub-zone/zone`);
        this.zones = zones;
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    async fetchItems() {
      try {
        this.loading = true;
        this.selectedItems = [];
        const { zones, total } = await this.$api.post(
          `/dashboard/sub-zone/fetch`,
          this.form
        );
        this.items = zones;
        this.total = total;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.init = true;
      }
    },
    updateRoute() {
      this.$router.push({ query: this.form });
    },
    sort(key) {
      if (!this.form.sort[key]) this.form.sort = {};
      this.form.sort[key] = this.form.sort[key] === 1 ? -1 : 1;
      this.fetchItems();
    },
    async submit() {
      try {
        this.submitLoading = true;
        if (this.editMode) {
          await this.$api.post(`/dashboard/sub-zone/edit`, this.inputForm);
          this.fetchItems();
        } else {
          await this.$api.post(`/dashboard/sub-zone/add`, this.inputForm);
          this.refetch();
        }
        this.reset();
        this.modal = false;
      } catch (error) {
        console.error(error);
        if (error?.response?._data?.errors) {
          this.errors = error.response._data.errors;
        }
      } finally {
        this.submitLoading = false;
      }
    },
    reset() {
      this.inputForm = {
        name: "",
      };
      this.errors = {};
      this.editMode = false;
    },
    refetch() {
      if (this.form.page == 1) {
        this.fetchItems();
      } else {
        this.form.page = 1;
      }
    },
    editZone(item) {
      this.inputForm = { ...item };
      this.editMode = true;
      this.modal = true;
    },
    async deleteZone(item) {
      try {
        if (!confirm(`Are you sure you want to delete this zone?`)) return;
        await this.$api.post(`/dashboard/sub-zone/delete`, { _id: item._id });
        this.fetchItems();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
