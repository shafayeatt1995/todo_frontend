<template>
  <Head>
    <Title>Users - Admin</Title>
  </Head>
  <Admin>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl"><UsersIcon /> Users</h1>
        <Button @click="modal = true"> <PlusIcon /> Add User </Button>
      </div>
      <div
        class="flex flex-wrap md:grid grid-cols-2 xl:flex gap-2 items-center justify-between"
      >
        <div class="flex gap-2 items-center order-1">
          <Input
            class="max-w-32 md:max-w-52"
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
              <TableHead class="w-10">
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <Checkbox
                  v-else
                  :modelValue="
                    selectedItems.length > 0 &&
                    selectedItems.length === items.length
                  "
                  @update:modelValue="selectAll"
                />
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
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('id')"
                >
                  <p>User ID</p>
                  <Sort :value="form.sort.id" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('type')"
                >
                  <p>Type</p>
                  <Sort :value="form.sort.type" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('suspended')"
                >
                  <p>Suspended</p>
                  <Sort :value="form.sort.suspended" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('refName')"
                >
                  <p>Created By</p>
                  <Sort :value="form.sort.refName" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('_id')"
                >
                  <p>Created At</p>
                  <Sort :value="form.sort._id" />
                </div>
              </TableHead>
              <TableHead class="w-14">
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <DropdownMenu v-else>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="hover:bg-transparent size-7 relative"
                    >
                      <span
                        class="absolute -top-1 -right-3 size-5 bg-black dark:bg-white rounded-full text-[10px] text-white dark:text-black flex items-center justify-center"
                        v-if="selectedItems.length > 0"
                        >{{ selectedItems.length }}</span
                      >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="" align="end">
                    <DropdownMenuItem
                      @click="batchToggleSuspend(false)"
                      :disabled="selectedItems.length === 0"
                    >
                      <PlayIcon />
                      <span>Active users</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="batchToggleSuspend(true)"
                      :disabled="selectedItems.length === 0"
                    >
                      <PauseIcon />
                      <span>Suspend users</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="batchDelete"
                      :disabled="selectedItems.length === 0"
                    >
                      <Trash2Icon />
                      <span>Delete users</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(user, i) in loading ? 10 : items" :key="i">
              <TableCell class="w-10">
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <Checkbox
                  v-else
                  :modelValue="checkCheckBox(user)"
                  @update:modelValue="toggleCheckbox(user)"
                />
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ user.name }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ user.id }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ user.type }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <Badge v-else-if="user.suspended" variant="destructive">
                  Suspended
                </Badge>
                <Badge v-else>Active</Badge>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ user.refName }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ $normalDate(user.createdAt) }}</span>
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
                    <DropdownMenuItem @click="editUser(user)">
                      <SquarePenIcon />
                      <span>Edit user</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="toggleSuspend(i)">
                      <PlayIcon v-if="user.suspended" />
                      <PauseIcon v-else />
                      <span
                        >{{ user.suspended ? "Active" : "Suspend" }} user</span
                      >
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="deleteUser(i)">
                      <Trash2Icon />
                      <span>Delete user</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <TableRow v-if="!loading && items.length === 0">
              <TableCell :colspan="10" class="h-24 text-center">
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
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} User</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="name"> Name </Label>
            <Input id="name" v-model="inputForm.name" />
            <ErrorMessage name="name" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="username"> User ID (login) </Label>
            <Input
              id="username"
              v-model="inputForm.id"
              @input="inputForm.id = inputForm.id.toLowerCase()"
            />
            <ErrorMessage name="id" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="password"> Password (login)</Label>
            <Input id="password" v-model="inputForm.password" />
            <ErrorMessage name="password" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="type"> Type </Label>
            <Select v-model="inputForm.type">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Business Owner</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="type" :error="errors" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} user
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Admin>
</template>

<script>
import {
  BookOpenIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  SquarePenIcon,
  PlusIcon,
  UsersIcon,
  PauseIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
} from "lucide-vue-next";

export default {
  name: "User",
  components: {
    ChevronDownIcon,
    BookOpenIcon,
    MoreHorizontalIcon,
    Trash2Icon,
    SquarePenIcon,
    PlusIcon,
    UsersIcon,
    PauseIcon,
    PlayIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Loader2Icon,
  },
  data() {
    return {
      perPageOptions: [25, 50, 100],
      searchByOptions: ["id", "name"],
      form: {
        page: 1,
        perPage: 25,
        keyword: "",
        searchBy: "id",
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
        id: "",
        password: "",
        type: "user",
      },
      submitLoading: false,
    };
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
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
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        this.loading = true;
        this.selectedItems = [];
        const { users, total } = await this.$api.post(
          "/admin/user/fetch",
          this.form
        );
        this.items = users;
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
    async toggleSuspend(i) {
      try {
        const user = this.items[i];
        if (
          !confirm(
            `Are you sure you want to ${
              user.suspended ? "activate" : "suspend"
            } this user?`
          )
        )
          return;
        await this.$api.post("/admin/user/toggle-suspend", { user });
        this.items[i].suspended = !this.items[i].suspended;
      } catch (error) {
        console.error(error);
      }
    },
    async batchToggleSuspend(suspend) {
      try {
        if (
          !confirm(
            `Are you sure you want to ${
              suspend ? "suspend" : "activate"
            } these users?`
          )
        )
          return;
        await this.$api.post("/admin/user/batch-toggle-suspend", {
          ids: this.selectedItems,
          suspend,
        });
        this.selectedItems.forEach((id) => {
          const i = this.items.findIndex(
            (user) => user._id === id && user._id !== this.authUser._id
          );
          if (i !== -1) {
            this.items[i].suspended = suspend;
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    toggleCheckbox(user) {
      if (this.checkCheckBox(user)) {
        this.selectedItems = this.selectedItems.filter((id) => id !== user._id);
      } else {
        this.selectedItems.push(user._id);
      }
    },
    checkCheckBox(user) {
      return this.selectedItems.includes(user._id);
    },
    selectAll() {
      if (this.selectedItems.length === this.items.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map((user) => user._id);
      }
    },
    async batchDelete() {
      try {
        if (!confirm(`Are you sure you want to delete selected users?`)) return;
        await this.$api.post("/admin/user/batch-delete", {
          ids: this.selectedItems,
        });
        this.fetchItems();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(i) {
      try {
        if (!confirm(`Are you sure you want to delete this user?`)) return;
        await this.$api.post("/admin/user/delete", { user: this.items[i] });
        this.items.splice(i, 1);
      } catch (error) {
        console.error(error);
      }
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
          await this.$api.post(`/admin/user/edit`, this.inputForm);
          this.fetchItems();
        } else {
          await this.$api.post("/admin/user/add", this.inputForm);
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
      this.inputForm = { name: "", id: "", password: "", type: "user" };
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
    editUser(user) {
      this.inputForm = { ...user };
      this.editMode = true;
      this.modal = true;
    },
  },
};
</script>
