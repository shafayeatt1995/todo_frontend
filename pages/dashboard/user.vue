<template>
  <LayoutDashboard>
    <div class="p-2">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Users</h1>
        <Button @click="modal = true"><PlusIcon /> Add User</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Name </TableHead>
            <TableHead> ID </TableHead>
            <TableHead> Suspended </TableHead>
            <TableHead class="w-14"> </TableHead>
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
              <Badge
                v-else
                :variant="user.suspended ? 'destructive' : 'default'"
                >{{ user.suspended ? "Suspended" : "Active" }}</Badge
              >
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
                  <DropdownMenuItem @click="editUser(i)">
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
  </LayoutDashboard>
  <Dialog v-model:open="modal">
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>{{ editMode ? "Edit" : "Add" }} user</DialogTitle>
      </DialogHeader>
      <div class="space-y-3">
        <div class="space-y-1">
          <Label for="name"> Name </Label>
          <Input id="name" v-model="inputForm.name" />
          <ErrorMessage name="name" :error="errors" />
        </div>
        <div class="space-y-1">
          <Label for="id"> Login ID </Label>
          <Input id="id" v-model="inputForm.id" />
          <ErrorMessage name="id" :error="errors" />
        </div>
        <div class="space-y-1">
          <Label for="password"> Password </Label>
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
</template>

<script>
import {
  PlusIcon,
  MoreHorizontalIcon,
  SquarePenIcon,
  BookOpenIcon,
  Loader2Icon,
  PlayIcon,
  PauseIcon,
  Trash2Icon,
} from "lucide-vue-next";

export default {
  name: "Dashboard",
  components: {
    PlusIcon,
    MoreHorizontalIcon,
    SquarePenIcon,
    BookOpenIcon,
    Loader2Icon,
    PlayIcon,
    PauseIcon,
    Trash2Icon,
  },
  data() {
    return {
      items: [],
      loading: true,
      modal: false,
      editMode: false,
      inputForm: {
        name: "",
        id: "",
        password: "",
      },
      submitLoading: false,
      errors: {},
    };
  },
  computed: {
    authUser() {
      const { authUser } = useAuth();
      return authUser.value;
    },
  },
  watch: {
    modal(val) {
      if (!val) this.reset();
    },
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        this.loading = true;
        const { items } = await this.$api.get("/dashboard/user");
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
        if (this.editMode) {
          await this.$api.put(`/dashboard/user`, this.inputForm);
        } else {
          await this.$api.post("/dashboard/user", this.inputForm);
        }
        this.fetchItems();
        this.modal = false;
      } catch (error) {
        console.error(error);
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
  },
};
</script>
