<template>
  <LayoutDashboard>
    <div class="p-2">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Complains</h1>
        <Button @click="modal = true"><PlusIcon /> Add Complain</Button>
      </div>
      <div class="mt-5">
        <div v-for="(item, i) in loading ? 10 : items" :key="i">
          <Separator v-if="i !== 0" class="my-2" />
          <div class="flex justify-between gap-5" v-if="loading">
            <Skeleton v-if="loading" class="w-20 h-16" />
            <div class="flex-1 space-y-4">
              <Skeleton v-if="loading" class="w-full h-5" />
              <Skeleton v-if="loading" class="size-5 w-full" />
            </div>
          </div>
          <div class="flex justify-between gap-5" v-else @click="openTodo(i)">
            <img
              :src="item?.image?.url || '/logo.png'"
              class="h-16 w-20 object-contain"
            />
            <div class="flex-1 flex flex-col overflow-hidden">
              <p class="truncate w-full text-sm font-medium">
                {{ item.title }}
              </p>
              <p class="truncate w-full text-xs font-medium">
                {{ item.user }}
              </p>
              <div class="flex w-full justify-between items-center">
                <p class="text-sm">
                  {{ $shortDate(item.createdAt) }}
                </p>
                <Badge :variant="getVariant(item.status)">{{
                  item.status
                }}</Badge>
                <DropdownMenu v-if="proUser">
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
                      @click="updateStatus('Running', i)"
                      v-if="item.status !== 'Running'"
                    >
                      Make Running
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
                    <DropdownMenuItem @click="deleteTodo(item)">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <!-- <p class="text-sm">
                {{
                  item.description.length > 120
                    ? item.description.slice(0, 120) + "..."
                    : item.description
                }}
              </p> -->
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
      <div class="flex justify-between items-center mt-5">
        <Button @click="changePage(-1)" :disabled="page === 1">
          <ChevronLeft /> Previous
        </Button>
        <Button @click="changePage(1)" :disabled="items.length !== perPage">
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  </LayoutDashboard>
  <Dialog v-model:open="modal">
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>{{ editMode ? "Edit" : "Add" }} Complain</DialogTitle>
      </DialogHeader>
      <div class="space-y-3">
        <div class="space-y-1">
          <Label for="title"> Title </Label>
          <Input id="title" v-model="inputForm.title" />
          <ErrorMessage name="title" :error="errors" />
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
          <img :src="todo.item?.image?.url || '/logo.png'" class="w-full" />
        </div>
        <p class="mt-4 font-bold text-xl">{{ todo.item.title }}</p>
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
</template>

<script>
import {
  PlusIcon,
  SquarePenIcon,
  Loader2Icon,
  Trash2Icon,
  ImagePlus,
  XIcon,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  BookOpenIcon,
} from "lucide-vue-next";

export default {
  name: "Dashboard",
  components: {
    PlusIcon,
    SquarePenIcon,
    Loader2Icon,
    Trash2Icon,
    ImagePlus,
    XIcon,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    BookOpenIcon,
  },
  data() {
    return {
      items: [],
      loading: true,
      modal: false,
      editMode: false,
      perPage: 20,
      inputForm: {
        title: "",
        description: "",
        image: "",
      },
      previewImage: "",
      submitLoading: false,
      errors: {},
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
    page() {
      return +this.$route.query.page || 1;
    },
    proUser() {
      return this.authUser?.proUser || false;
    },
    getVariant() {
      return (status = "") => {
        if (status === "Pending") return "amber";
        if (status === "Running") return "blue";
        if (status === "Completed") return "green";
        if (status === "Cancelled") return "rose";
      };
    },
  },
  watch: {
    modal(val) {
      if (!val) this.reset();
    },
    page() {
      this.fetchItems();
    },
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        this.loading = true;
        const { items } = await this.$api.get("/dashboard/todo", {
          page: this.page,
          perPage: this.perPage,
        });
        this.items = items;
      } catch (error) {
        console.error(error);
        if (error?.response?._data?.errors) {
          this.errors = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      try {
        this.submitLoading = true;

        const formData = new FormData();
        formData.append("title", this.inputForm.title);
        formData.append("description", this.inputForm.description);
        if (this.inputForm.image)
          formData.append("image", this.inputForm.image);
        if (this.editMode) {
          await this.$api.put("/dashboard/todo", this.inputForm);
        } else {
          await this.$api.post("/dashboard/todo", null, formData);
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
    editUser(i) {
      this.inputForm = this.items[i];
      this.editMode = true;
      this.modal = true;
    },
    reset() {
      this.inputForm = {
        name: "",
        id: "",
        password: "",
      };
      this.previewImage = "";
      this.errors = {};
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
    async deleteUser(i) {
      try {
        const user = this.items[i];
        if (!confirm(`Are you sure you want to delete this user?`)) return;
        await this.$api.post("/dashboard/user/delete", { user });
        this.items.splice(i, 1);
      } catch (error) {
        console.error(error);
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
    openTodo(i) {
      const todo = this.items[i];
      this.todo.item = todo;
      this.todo.modal = true;
    },
    editTodo(todo) {
      this.editMode = true;
      this.inputForm = todo;
      this.todo.modal = false;
      this.modal = true;
    },
    async deleteTodo(todo) {
      try {
        if (!confirm(`Are you sure you want to delete this todo?`)) return;
        await this.$api.post("/dashboard/todo/delete", { todo });
        this.fetchItems();
        this.todo.modal = false;
      } catch (error) {
        console.error(error);
      }
    },
    async updateStatus(status, i) {
      try {
        const todo = this.items[i];
        if (!confirm(`Are you sure you want to update this todo?`)) return;
        await this.$api.post("/dashboard/todo/update-status", { todo, status });
        this.items[i].status = status;
        this.todo.modal = false;
      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      if (page === -1 && this.page === 1) return;
      if (page === 1 && this.page === this.totalPages) return;
      this.$router.push({
        query: {
          page: +this.page + page,
        },
      });
    },
  },
};
</script>
