<template>
  <Head>
    <Title>Business - Admin</Title>
  </Head>
  <Admin>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl">
          <BriefcaseBusinessIcon /> Business
        </h1>
        <Button @click="modal = true"> <PlusIcon /> Add Business </Button>
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
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.name }}
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
                  @click="sort('logo')"
                >
                  <p>Logo</p>
                  <Sort :value="form.sort.logo" />
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
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('exp')"
                >
                  <p>Expired At</p>
                  <Sort :value="form.sort.exp" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('ownerIDs')"
                >
                  <p>Owner</p>
                  <Sort :value="form.sort.ownerIDs" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('staffIDs')"
                >
                  <p>Staff</p>
                  <Sort :value="form.sort.staffIDs" />
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
                      @click="batchDelete"
                      :disabled="selectedItems.length === 0"
                    >
                      <Trash2Icon />
                      <span>Delete businesses</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(business, i) in loading ? 10 : items" :key="i">
              <TableCell class="w-10">
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <Checkbox
                  v-else
                  :modelValue="checkCheckBox(business)"
                  @update:modelValue="toggleCheckbox(business)"
                />
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else
                  ><img
                    :src="business?.image?.url || '/2.webp'"
                    class="max-w-10 max-h-10"
                /></span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ business.name }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <Badge
                  v-else
                  :variant="
                    new Date(business.exp) < new Date()
                      ? 'destructive'
                      : 'default'
                  "
                  >{{ $normalDate(business.exp) }}</Badge
                >
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ business.ownerIDs.length }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ business.staffIDs.length }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ business.refName }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ $normalDate(business.createdAt) }}</span>
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
                    <DropdownMenuItem @click="editBusiness(business)">
                      <SquarePenIcon />
                      <span>Edit business</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openUser('owner', i)">
                      <UserPlusIcon />
                      <span>Add owner</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openUser('staff', i)">
                      <UserPlusIcon />
                      <span>Add staff</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="deleteBusiness(i)">
                      <Trash2Icon />
                      <span>Delete business</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <TableRow v-if="!loading && items.length === 0">
              <TableCell :colspan="9" class="h-24 text-center">
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
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} Business</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="name"> Business name </Label>
            <Input id="name" v-model="inputForm.name" />
            <ErrorMessage name="name" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label
              for="image"
              class="border border-dashed p-2 rounded flex justify-center h-72 text-gray-800 cursor-pointer"
            >
              <div
                class="relative w-full h-full"
                v-if="previewImage || inputForm.image?.url"
              >
                <img
                  :src="previewImage || inputForm.image?.url"
                  class="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  @click.stop.prevent="resetImage"
                  class="absolute top-0 right-0"
                  variant="destructive"
                  size="icon"
                  v-if="previewImage"
                >
                  <XIcon :size="20" />
                </Button>
              </div>
              <ImagePlus :size="80" v-else />
            </Label>
            <Input
              id="image"
              accept="image/*"
              type="file"
              class="hidden"
              @change="onFileChange"
            />
            <ErrorMessage name="image" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="exp">
              Expired At
              <span class="text-xs">({{ inputForm.exp }})</span></Label
            >
            <CustomCalender
              :modelValue="inputForm.exp"
              @update:modelValue="inputForm.exp = $event"
            />
            <ErrorMessage name="exp" :error="errors" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} business
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="userData.userModal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Add {{ userData.userType }} to business</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="id"> Search by user ID </Label>
            <Input id="id" v-model="userData.searchID" />
          </div>
          <div
            class="max-h-60 overflow-y-auto space-y-1 border rounded-md overflow-hidden p-2"
          >
            <div v-for="(user, i) in userData.selectUser" :key="i">
              <Separator v-if="i !== 0" />
              <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-2">
                  <img src="/1.webp" class="max-w-10 max-h-10" />
                  <div>
                    <p>{{ user.name }}</p>
                    <p>{{ user.id }}</p>
                  </div>
                </div>
                <Button variant="outline" @click="removeUser(i)">
                  <Trash2Icon />
                </Button>
              </div>
            </div>
            <p v-if="!userData.selectUser.length" class="text-center">
              No {{ userData.userType }} selected
            </p>
          </div>
          <div
            class="flex flex-col max-h-60 h-60 items-center justify-center space-y-1 border rounded-md overflow-hidden"
            :class="matchUser.length ? 'justify-start' : 'justify-center'"
          >
            <Loader2Icon v-if="userData.searchLoading" class="animate-spin" />
            <template v-else-if="matchUser.length">
              <div class="w-full px-2 overflow-y-auto">
                <div v-for="(user, i) in matchUser" :key="i">
                  <Separator v-if="i !== 0" />
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-2">
                      <img src="/1.webp" class="max-w-10 max-h-10" />
                      <div>
                        <p>{{ user.name }}</p>
                        <p>{{ user.id }}</p>
                      </div>
                    </div>
                    <Button variant="outline" @click="addUser(user)">
                      <PlusIcon />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <BookOpenIcon :size="50" />
              <p class="">No results found.</p>
            </template>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" :disabled="submitLoading" @click="updateUser">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            Add {{ userData.userType }}
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
  PauseIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  BriefcaseBusinessIcon,
  UserPlusIcon,
  ImagePlus,
  XIcon,
} from "lucide-vue-next";
import {
  today,
  getLocalTimeZone,
  toCalendarDate,
  fromDate,
} from "@internationalized/date";

export default {
  name: "Business",
  components: {
    ChevronDownIcon,
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
    BriefcaseBusinessIcon,
    UserPlusIcon,
    ImagePlus,
    XIcon,
  },
  data() {
    return {
      perPageOptions: [25, 50, 100],
      searchByOptions: [
        { name: "Name", value: "name" },
        { name: "Created by", value: "refName" },
      ],
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
      inputForm: { name: "", image: null, exp: today(getLocalTimeZone()) },
      previewImage: "",
      submitLoading: false,
      userData: {
        userModal: false,
        userType: "owner",
        editUser: {},
        searchID: "",
        searchResults: [],
        selectUser: [],
        searchLoading: false,
      },
    };
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
    matchUser() {
      return (
        this.userData.searchResults.filter(
          (user) => !this.userData.selectUser.some((u) => u._id === user._id)
        ) || []
      );
    },
  },
  watch: {
    "form.page"() {
      if (this.init) {
        this.updateRoute();
        this.fetchItems();
      }
    },
    "form.perPage"() {
      if (this.init) {
        this.updateRoute();
        this.refetch();
      }
    },
    "form.keyword"() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.updateRoute();
        this.refetch();
      }, 500);
    },
    "form.searchBy"() {
      if (this.form.keyword) {
        this.updateRoute();
        this.refetch();
      }
    },
    "userData.searchID"() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchUser();
      }, 500);
    },
    "userData.userModal"(val) {
      if (!val) this.resetUserData();
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
        const { businesses, total } = await this.$api.post(
          "/admin/business/fetch",
          this.form
        );
        this.items = businesses;
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
    toggleCheckbox(business) {
      if (this.checkCheckBox(business)) {
        this.selectedItems = this.selectedItems.filter(
          (id) => id !== business._id
        );
      } else {
        this.selectedItems.push(business._id);
      }
    },
    checkCheckBox(business) {
      return this.selectedItems.includes(business._id);
    },
    selectAll() {
      if (this.selectedItems.length === this.items.length) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map((business) => business._id);
      }
    },
    async batchDelete() {
      try {
        if (!confirm(`Are you sure you want to delete selected businesses?`))
          return;
        await this.$api.post("/admin/business/batch-delete", {
          ids: this.selectedItems,
        });
        this.fetchItems();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteBusiness(i) {
      try {
        if (!confirm(`Are you sure you want to delete this business?`)) return;
        await this.$api.post("/admin/business/delete", {
          business: this.items[i],
        });
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
        const formData = new FormData();
        if (this.inputForm._id) formData.append("_id", this.inputForm._id);
        formData.append("name", this.inputForm.name);
        formData.append("image", this.inputForm.image);
        const { year, month, day } = this.inputForm.exp;
        const date = new Date(year, month - 1, day);
        formData.append("exp", date.toISOString());
        if (this.editMode) {
          await this.$api.post(`/admin/business/edit`, null, formData);
          this.fetchItems();
        } else {
          await this.$api.post("/admin/business/add", null, formData);
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
      this.previewImage = "";
      this.inputForm = { name: "", image: "", exp: today(getLocalTimeZone()) };
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
    async editBusiness(business) {
      this.inputForm = {
        ...business,
        exp: toCalendarDate(fromDate(new Date(business.exp))),
      };
      this.editMode = true;
      this.modal = true;
    },
    async openUser(type, i) {
      try {
        this.userData.searchLoading = true;
        this.userData.userModal = true;
        const { business } = await this.$api.post(`/admin/business`, {
          business: this.items[i],
          type,
        });
        this.userData.userType = type;
        this.userData.editUser = business;
        this.userData.selectUser =
          type === "owner" ? business.owners : business.staffs;
      } catch (error) {
        console.error(error);
      } finally {
        this.userData.searchLoading = false;
      }
    },
    async searchUser() {
      try {
        this.userData.searchLoading = true;
        const { users } = await this.$api.get("/admin/business/search-user", {
          id: this.userData.searchID,
        });
        this.userData.searchResults = users;
      } catch (error) {
        console.error(error);
      } finally {
        this.userData.searchLoading = false;
      }
    },
    addUser(user) {
      if (this.userData.userType === "owner") {
        this.userData.selectUser.push(user);
      } else {
        this.userData.selectUser.push(user);
      }
    },
    removeUser(i) {
      this.userData.selectUser.splice(i, 1);
    },
    async updateUser() {
      try {
        this.submitLoading = true;
        await this.$api.post(`/admin/business/update-user`, {
          business: this.userData.editUser,
          type: this.userData.userType,
          users: this.userData.selectUser,
        });
        this.fetchItems();
        this.userData.userModal = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.submitLoading = false;
      }
    },
    resetUserData() {
      this.userData = {
        userModal: false,
        userType: "owner",
        editUser: {},
        searchID: "",
        searchResults: [],
        selectUser: [],
        searchLoading: false,
      };
    },
    onFileChange(e) {
      this.inputForm.image = e.target.files[0];
      this.previewImage = URL.createObjectURL(e.target.files[0]);
    },
    resetImage() {
      this.inputForm.image = "";
      this.previewImage = "";
    },
  },
};
</script>
