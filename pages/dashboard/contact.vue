<template>
  <Head>
    <Title>Contact - Dashboard</Title>
  </Head>
  <Dashboard>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl">
          <ContactIcon /> Contact
        </h1>
        <Button @click="modal = true"> <PlusIcon /> Add Contact </Button>
      </div>
      <Input v-model="form.search" placeholder="Search..." />
      <div class="overflow-y-auto divide-y divide-gray-300">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="py-2 flex justify-between items-center"
        >
          <p class="cursor-pointer flex-1" @click="show(i)">
            {{ item.id }}. {{ item.name }} ({{ item.phone }})
          </p>
          <DropdownMenu>
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
              <DropdownMenuItem @click="createComplain(i)">
                <BookOpenTextIcon />
                <span>Create complain</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="editContact(i)">
                <SquarePenIcon />
                <span>Edit contact</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a :href="`tel:${item.phone}`" class="flex gap-2 items-center">
                  <PhoneCallIcon />
                  <span>Call</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem @click="deleteContact(i)" v-if="isOwner">
                <Trash2Icon />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div class="flex justify-center mt-5">
        <Button @click="loadMore" :disabled="loading" v-if="loaded">
          <Loader2Icon v-if="loading" class="animate-spin" />Load More
        </Button>
      </div>
    </div>
    <Dialog v-model:open="modal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} Contact</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="id"> ID </Label>
            <Input id="id" v-model="inputForm.id" />
            <ErrorMessage name="id" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="name"> Name </Label>
            <Input id="name" v-model="inputForm.name" />
            <ErrorMessage name="name" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="phone"> Phone </Label>
            <Input id="phone" v-model="inputForm.phone" />
            <ErrorMessage name="phone" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="address"> Address </Label>
            <Textarea id="address" v-model="inputForm.address" />
            <ErrorMessage name="address" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="package"> Package </Label>
            <Select v-model="inputForm.packageID">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="pack in packages"
                    :key="pack._id"
                    :value="pack._id"
                  >
                    {{ pack.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="packageID" :error="errors" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} Contact
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="showModal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>
        <div class="space-y-2">
          <p>ID: {{ selectItem.id }}</p>
          <p>Name: {{ selectItem.name }}</p>
          <p class="flex gap-2 items-center">
            Phone: {{ selectItem.phone }}
            <a :href="`tel:${selectItem.phone}`"><PhoneCallIcon /></a>
          </p>
          <p>
            Package: {{ selectItem.package?.name }}({{
              selectItem.package?.price
            }})
          </p>
          <p>Address: {{ selectItem.address }}</p>
        </div>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="complain.modal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Create Complain</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="title"> Title </Label>
            <Input id="title" v-model="complain.form.title" />
            <ErrorMessage name="title" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="description"> Description </Label>
            <Textarea id="description" v-model="complain.form.description" />
            <ErrorMessage name="description" :error="errors" />
          </div>
          <div class="space-y-1" v-if="!editMode">
            <Label
              for="image"
              class="border border-dashed p-2 rounded flex justify-center h-72 text-gray-800"
            >
              <div class="relative w-full h-full" v-if="complain.previewImage">
                <img
                  :src="complain.previewImage"
                  class="w-full h-full object-contain"
                />
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
          <Button
            type="button"
            @click="submitComplain"
            :disabled="submitLoading"
          >
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} Complain
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Dashboard>
</template>

<script>
import {
  ContactIcon,
  PlusIcon,
  Loader2Icon,
  PhoneCallIcon,
  MoreHorizontalIcon,
  SquarePenIcon,
  Trash2Icon,
  BookOpenTextIcon,
  ImagePlus,
  XIcon,
} from "lucide-vue-next";

export default {
  name: "Contact",
  components: {
    ContactIcon,
    PlusIcon,
    Loader2Icon,
    PhoneCallIcon,
    MoreHorizontalIcon,
    SquarePenIcon,
    BookOpenTextIcon,
    Trash2Icon,
    ImagePlus,
    XIcon,
  },
  data() {
    return {
      modal: false,
      editMode: false,
      submitLoading: false,
      form: {
        page: 1,
        perPage: 50,
        search: "",
      },
      inputForm: {
        id: "",
        name: "",
        phone: "",
        address: "",
        packageID: "",
      },
      errors: {},
      packages: [],
      items: [],
      showModal: false,
      selectItem: null,
      debounceTimer: null,
      loading: false,
      loaded: false,
      complain: {
        user: null,
        modal: false,
        form: {
          title: "",
          description: "",
          image: null,
        },
        previewImage: null,
      },
    };
  },
  computed: {
    isOwner() {
      const { isOwner } = usePermission();
      return isOwner.value;
    },
  },
  watch: {
    modal(val) {
      if (!val) this.reset();
    },
    "form.search"() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.refetch();
      }, 500);
    },
  },
  mounted() {
    this.getPackage();
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        this.loading = true;
        const { contacts } = await this.$api.get(
          "/dashboard/contact",
          this.form
        );
        this.items.push(...contacts);
        this.loaded = this.items.length === this.form.perPage;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getPackage() {
      try {
        const { packages } = await this.$api.get("/dashboard/contact/package");
        this.packages = packages;
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      this.submitLoading = true;
      try {
        if (this.editMode) {
          await this.$api.put(`/dashboard/contact`, this.inputForm);
        } else {
          await this.$api.post("/dashboard/contact", this.inputForm);
        }
        this.modal = false;
        this.submitLoading = false;
        this.refetch();
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
        id: "",
        name: "",
        phone: "",
        address: "",
        packageID: "",
      };
      this.errors = {};
    },
    show(i) {
      this.selectItem = this.items[i];
      this.showModal = true;
    },
    refetch() {
      this.form.page = 1;
      this.items = [];
      this.loaded = false;
      this.fetchItems();
    },
    loadMore() {
      this.form.page += 1;
      this.fetchItems();
    },
    editContact(i) {
      this.inputForm = this.items[i];
      this.editMode = true;
      this.modal = true;
    },
    async deleteContact(i) {
      try {
        if (!this.isOwner) return;
        if (!confirm(`Are you sure you want to delete this contact?`)) return;
        await this.$api.post(`/dashboard/contact/delete`, {
          contact: this.items[i],
        });
        this.items.splice(i, 1);
      } catch (error) {
        console.error(error);
      }
    },
    createComplain(i) {
      this.complain.user = this.items[i];
      this.complain.modal = true;
    },
    resetImage() {
      this.complain.form.image = null;
      this.complain.previewImage = null;
    },
    onFileChange(e) {
      this.complain.form.image = e.target.files[0];
      this.complain.previewImage = URL.createObjectURL(e.target.files[0]);
    },
    async submitComplain() {
      try {
        this.submitLoading = true;
        const formData = new FormData();
        formData.append("title", this.complain.form.title);
        formData.append("description", this.complain.form.description);
        formData.append("userID", this.complain.user.id);
        if (this.complain.form.image)
          formData.append("image", this.complain.form.image);
        await this.$api.post("/dashboard/todo/add", null, formData);

        this.refetch();
        this.complain.modal = false;
      } catch (error) {
        console.error(error);
        if (error?.response?._data?.errors) {
          this.errors = error.response._data.errors;
        }
      } finally {
        this.submitLoading = false;
      }
    },
  },
};
</script>
