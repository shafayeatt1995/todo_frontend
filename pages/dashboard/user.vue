<template>
  <Head>
    <Title>Users - Dashboard</Title>
  </Head>
  <Dashboard>
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
              <TableHead>Name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Suspended</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(user, i) in loading ? 10 : items" :key="i">
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <TableRow v-if="!loading && items.length === 0">
              <TableCell :colspan="5" class="h-24 text-center">
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
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} user
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="permissionModal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Permission</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <table
            class="table-auto border-[3px] border-black dark:border-white w-full"
          >
            <thead>
              <tr>
                <th
                  class="border border-black dark:border-white px-4 py-2 text-center align-middle"
                >
                  Group
                </th>
                <th
                  class="border border-black dark:border-white px-4 py-2 text-center align-middle"
                >
                  Permission
                </th>
                <th
                  class="border border-black dark:border-white px-4 py-2 text-center align-middle"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody
              v-for="(group, i) in permissions"
              :key="i"
              class="border-[3px] border-black dark:border-white"
            >
              <tr v-for="(option, index) in group.options" :key="option.value">
                <td
                  v-if="index === 0"
                  :rowspan="group.options.length"
                  class="border border-black dark:border-white px-4 py-2 font-bold text-center align-middle"
                >
                  {{ group.name }}
                </td>
                <td
                  class="border border-black dark:border-white px-4 py-2 text-center align-middle"
                >
                  {{ option.name }}
                </td>
                <td
                  class="border border-black dark:border-white px-4 py-2 text-center align-middle"
                >
                  <Switch
                    :modelValue="checkPermission(option.value)"
                    @update:modelValue="togglePermission(option.value)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button
            type="button"
            @click="updatePermission"
            :disabled="submitLoading"
          >
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            Update permission
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="package.modal">
      <DialogScrollContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle> Set Package</DialogTitle>
        </DialogHeader>
        <div>
          <div class="border rounded-md max-h-64 overflow-y-auto">
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <p>Name</p>
                    </TableHead>
                    <TableHead>
                      <p>Price</p>
                    </TableHead>
                    <TableHead>
                      <p>vatAmount</p>
                    </TableHead>
                    <TableHead>
                      <p>vatPercent</p>
                    </TableHead>
                    <TableHead>
                      <p>Action</p>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(pack, i) in package.loading ? 10 : package.items"
                    :key="i"
                  >
                    <TableCell>
                      <Skeleton
                        class="w-full h-5 rounded-full"
                        v-if="package.loading"
                      />
                      <span v-else>{{ pack.name }}</span>
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        class="w-full h-5 rounded-full"
                        v-if="package.loading"
                      />
                      <span v-else>{{ pack.price }}</span>
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        class="w-full h-5 rounded-full"
                        v-if="loading"
                      />
                      <span v-else>{{ pack.vatType }}</span>
                    </TableCell>
                  </TableRow>

                  <TableRow v-if="!loading && items.length === 0">
                    <TableCell :colspan="10" class="h-24 text-center">
                      <div
                        class="flex flex-col items-center justify-center py-10"
                      >
                        <BookOpenIcon :size="50" />
                        <p class="">No results found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            @click="updatePermission"
            :disabled="submitLoading"
          >
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            Update Package
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Dashboard>
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
  UserLockIcon,
  DollarSignIcon,
} from "lucide-vue-next";
import TableHead from "../../components/ui/table/TableHead.vue";

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
    UserLockIcon,
    DollarSignIcon,
    TableHead,
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
      },
      submitLoading: false,
      permissionModal: false,
      userPermission: null,
      package: {
        user: {},
        items: [],
        loading: false,
        loaded: false,
        modal: false,
      },
    };
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
    permissions() {
      const { permissions } = usePermission();
      return permissions.value;
    },
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
    permissionModal(val) {
      if (!val) {
        this.userPermission = null;
      }
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
          "/dashboard/user/fetch",
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
        await this.$api.post("/dashboard/user/toggle-suspend", { user });
        this.items[i].suspended = !this.items[i].suspended;
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      try {
        this.submitLoading = true;
        if (this.editMode) {
          await this.$api.post(`/dashboard/user/edit`, this.inputForm);
          this.fetchItems();
        } else {
          await this.$api.post("/dashboard/user/add", this.inputForm);
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
        id: "",
        password: "",
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
    editUser(user) {
      this.inputForm = { ...user };
      this.editMode = true;
      this.modal = true;
    },
  },
};
</script>
