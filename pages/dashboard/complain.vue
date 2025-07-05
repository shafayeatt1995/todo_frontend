<template>
  <Head>
    <Title>Complain - Dashboard</Title>
  </Head>
  <Dashboard>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl">
          <BookOpenTextIcon /> Complain
        </h1>
        <Button @click="modal = true"> <PlusIcon /> Add Complain </Button>
      </div>
      <div
        class="flex flex-wrap md:grid grid-cols-2 xl:flex gap-2 items-center justify-between"
      >
        <div class="flex gap-2 items-center order-1">
          <Input
            class="max-w-36 md:max-w-52"
            placeholder="Search..."
            v-model="form.keyword"
          />
          <Select v-model="form.searchBy" v-if="false">
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
      <div class="mt-5 grid xl:grid-cols-3 md:grid-cols-2 md:gap-5">
        <div v-for="(item, i) in loading ? 10 : items" :key="i">
          <Separator v-if="i !== 0" class="my-2 md:hidden" />
          <div class="flex justify-between gap-5" v-if="loading">
            <Skeleton v-if="loading" class="w-20 h-16" />
            <div class="flex-1 space-y-4">
              <Skeleton v-if="loading" class="w-full h-5" />
              <Skeleton v-if="loading" class="size-5 w-full" />
            </div>
          </div>
          <div
            class="flex justify-between gap-2 cursor-pointer"
            v-else
            @click="openTodo(i)"
          >
            <img
              :src="
                item?.image?.url || authUser.business?.image?.url || '/2.webp'
              "
              class="h-16 w-20 object-contain"
            />
            <div class="flex-1 flex flex-col overflow-hidden">
              <p class="text-sm font-medium">
                {{ limitedText(item.user, item.description) }}
              </p>
              <div class="flex w-full justify-between items-center">
                <p class="text-sm">
                  {{ $shortDate(item.createdAt) }}
                </p>
                <Badge :variant="getVariant(item.status)">{{
                  item.status
                }}</Badge>
                <DropdownMenu v-if="isOwner">
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="hover:bg-transparent size-7 relative"
                      @click.stop.prevent
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="copyUserID(item.user)"
                      v-if="item.user"
                    >
                      Copy user id
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editTodo(item)">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="updateStatus('Pending', i)"
                      v-if="item.status !== 'Pending'"
                    >
                      Make Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="updateStatus('Working', i)"
                      v-if="item.status !== 'Working'"
                    >
                      Make Working
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="updateStatus('Completed', i)"
                      v-if="item.status !== 'Completed'"
                    >
                      Make Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="updateStatus('Cancelled', i)"
                      v-if="item.status !== 'Cancelled'"
                    >
                      Make Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="deleteTodo(item)" v-if="isOwner">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="items.length === 0 && !loading"
          class="w-full flex justify-center flex-col items-center py-20"
        >
          <BookOpenIcon :size="50" />
          <p>No data found</p>
        </div>
      </div>
    </div>
    <Dialog v-model:open="modal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} Complain</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="user"> User ID (optional) </Label>
            <Input id="user" v-model="inputForm.user" />
            <ErrorMessage name="user" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="description"> Description </Label>
            <Textarea id="description" v-model="inputForm.description" />
            <ErrorMessage name="description" :error="errors" />
          </div>
          <div class="space-y-1" v-if="!editMode">
            <Label
              for="image"
              class="border border-dashed p-2 rounded flex justify-center h-72 text-gray-800"
            >
              <div class="relative w-full h-full" v-if="previewImage">
                <img :src="previewImage" class="w-full h-full object-contain" />
                <Button
                  type="button"
                  @click.stop.prevent="resetImage"
                  class="absolute top-0 right-0"
                  variant="destructive"
                  size="icon"
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
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} Complain
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="todo.modal">
      <DialogScrollContent v-if="todo.item">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div>
          <div class="flex w-full justify-center">
            <img
              v-if="todo.item?.image?.url || authUser?.business?.image?.url"
              :src="todo.item?.image?.url || authUser?.business?.image?.url"
              class="w-full max-h-96 object-contain"
            />
          </div>
          <p class="mt-4 font-bold text-xl">{{ todo.item.description }}</p>
          <p class="mb-2">{{ todo.item.user }}</p>
          <div class="flex justify-between items-center">
            <p class="text-sm">{{ $shortDate(todo.item.createdAt) }}</p>
            <Badge :variant="getVariant(todo.item.status)">{{
              todo.item.status
            }}</Badge>
          </div>
          <p class="mt-5">{{ todo.item.description }}</p>
        </div>
        <DialogFooter>
          <div class="flex gap-2 justify-end">
            <Button class="flex-1" type="button" @click="todo.modal = false">
              <XIcon /> Close
            </Button>
          </div>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Dashboard>
</template>

<script>
import {
  BookOpenTextIcon,
  BookOpenIcon,
  PlusIcon,
  MoreHorizontal,
  XIcon,
  ImagePlus,
  Loader2Icon,
} from "lucide-vue-next";

export default {
  name: "User",
  components: {
    BookOpenTextIcon,
    MoreHorizontal,
    PlusIcon,
    BookOpenIcon,
    XIcon,
    ImagePlus,
    Loader2Icon,
  },
  data() {
    return {
      perPageOptions: [25, 50, 100],
      searchByOptions: ["user", "description"],
      form: {
        page: 1,
        perPage: 25,
        keyword: "",
        searchBy: "user",
        sort: { _id: -1 },
      },
      errors: {},
      items: [],
      total: 0,
      loading: true,
      init: false,
      debounceTimer: null,
      modal: false,
      editMode: false,
      inputForm: {
        user: "",
        description: "",
        image: "",
      },
      previewImage: "",
      submitLoading: false,
      todo: {
        modal: false,
        item: null,
      },
    };
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
    getVariant() {
      return (status = "") => {
        if (status === "Pending") return "amber";
        if (status === "Working") return "blue";
        if (status === "Completed") return "green";
        if (status === "Cancelled") return "rose";
      };
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
        const { items, total } = await this.$api.post(
          "/dashboard/todo/fetch",
          this.form
        );
        this.items = items;
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
    refetch() {
      if (this.form.page == 1) {
        this.fetchItems();
      } else {
        this.form.page = 1;
      }
    },
    onFileChange(e) {
      this.inputForm.image = e.target.files[0];
      this.previewImage = URL.createObjectURL(e.target.files[0]);
    },
    resetImage() {
      this.inputForm.image = "";
      this.previewImage = "";
    },
    async submit() {
      try {
        this.submitLoading = true;

        const formData = new FormData();
        formData.append("user", this.inputForm.user);
        formData.append("description", this.inputForm.description);
        if (this.inputForm.image)
          formData.append("image", this.inputForm.image);
        if (this.editMode) {
          await this.$api.put("/dashboard/todo/update", this.inputForm);
        } else {
          await this.$api.post("/dashboard/todo/add", null, formData);
        }

        this.fetchItems();
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
      this.editMode = false;
      this.inputForm = {
        user: "",
        description: "",
        image: "",
      };
      this.previewImage = "";
    },
    editTodo(todo) {
      this.editMode = true;
      this.inputForm = todo;
      this.todo.modal = false;
      this.modal = true;
    },
    openTodo(i) {
      const todo = this.items[i];
      this.todo.item = todo;
      this.todo.modal = true;
    },
    async deleteTodo(todo) {
      try {
        if (!confirm(`Are you sure you want to delete this complain?`)) return;
        await this.$api.post(`/dashboard/todo/delete`, { todo });
        this.fetchItems();
      } catch (error) {
        console.error(error);
      }
    },
    async updateStatus(status, i) {
      try {
        const todo = this.items[i];
        if (!confirm(`Are you sure you want to update this complain?`)) return;
        await this.$api.post("/dashboard/todo/update-status", { todo, status });
        this.items[i].status = status;
        this.todo.modal = false;
      } catch (error) {
        console.error(error);
      }
    },
    limitedText(user, description) {
      const userPart = user ? `${user} - ` : "";
      const fullText = `${userPart}${description || ""}`;
      return fullText.length > 60 ? fullText.slice(0, 60) + "..." : fullText;
    },
    async copyUserID(userID) {
      try {
        await navigator.clipboard.writeText(userID);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
