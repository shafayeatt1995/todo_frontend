<template>
  <Head>
    <Title>Customer - Dashboard</Title>
  </Head>
  <Dashboard>
    <div class="w-full space-y-2">
      <div class="flex justify-between">
        <h1 class="flex gap-2 items-center text-2xl font-bold">
          <ContactIcon />Customer
        </h1>
        <Button @click="modal = true"> <PlusIcon /> Add Customer </Button>
      </div>
      <div class="bg-white sticky top-16 py-2 mb-0">
        <Input v-model="form.search" placeholder="Search..." class="w-full" />
      </div>
      <div class="overflow-y-auto divide-y divide-gray-300">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="py-2 flex justify-between items-center"
        >
          <div
            class="cursor-pointer flex-1 flex gap-2 items-center"
            @click="show(i)"
          >
            <p>{{ item.id }}</p>
            <p>-></p>
            <div>
              <p>{{ item.name }}</p>
              <p>{{ item.phone }}</p>
            </div>
          </div>
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
              <DropdownMenuItem @click="copyID(item.id)">
                <CopyIcon />
                <span>Copy ID</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="editCustomer(i)">
                <SquarePenIcon />
                <span>Edit customer</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a :href="`tel:${item.phone}`" class="flex gap-2 items-center">
                  <PhoneCallIcon />
                  <span>Call</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem @click="deleteCustomer(i)" v-if="isOwner">
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
          <DialogTitle>{{ editMode ? "Edit" : "Add" }} Customer</DialogTitle>
        </DialogHeader>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label for="id"> User ID </Label>
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
            <Label for="package"> Package </Label>
            <Input id="package" v-model="inputForm.package" />
            <ErrorMessage name="package" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="zone"> Zone </Label>
            <Select v-model="inputForm.zoneID">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a zone" />
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
            <ErrorMessage name="zoneID" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="subZone"> Sub zone </Label>
            <Select v-model="inputForm.subZoneID">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a sub zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="subZone in subZones"
                    :key="subZone._id"
                    :value="subZone._id"
                  >
                    {{ subZone.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="subZoneID" :error="errors" />
          </div>
          <div class="space-y-1">
            <Label for="address"> Address </Label>
            <Textarea id="address" v-model="inputForm.address" />
            <ErrorMessage name="address" :error="errors" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" @click="submit" :disabled="submitLoading">
            <Loader2Icon v-if="submitLoading" class="animate-spin" />
            {{ editMode ? "Update" : "Add" }} Customer
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="showModal">
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div class="space-y-2">
          <p class="flex gap-2 items-center">
            <span> ID: {{ selectItem.id }} </span>
            <Button size="sm" @click="copyID(selectItem.id)">
              <CopyIcon />
              <span>Copy ID</span>
            </Button>
          </p>
          <p>Name: {{ selectItem.name }}</p>
          <p class="flex gap-2 items-center">
            Phone: {{ selectItem.phone }}
            <a
              :class="cn(buttonVariants({ variant: 'default', size: 'sm' }))"
              :href="`tel:${selectItem.phone}`"
              ><PhoneCallIcon /> Call</a
            >
          </p>
          <p>Zone: {{ selectItem.zone?.name }}</p>
          <p>Sub-zone: {{ selectItem.subZone?.name }}</p>
          <p>Address: {{ selectItem?.address }}</p>
          <p>Package: {{ selectItem?.package }}</p>
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
            <Label for="user"> User ID </Label>
            <Input id="user" v-model="complain.form.user" />
            <ErrorMessage name="user" :error="errors" />
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
  CopyIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";

export default {
  name: "Customer",
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
    CopyIcon,
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
        package: "",
        address: "",
        zoneID: "",
        subZoneID: "",
      },
      errors: {},
      zones: [],
      subZones: [],
      items: [],
      showModal: false,
      selectItem: null,
      debounceTimer: null,
      loading: false,
      loaded: false,
      complain: {
        modal: false,
        form: {
          user: "",
          description: "",
          image: null,
        },
        previewImage: null,
      },
      editInit: false,
      zoneLoaded: false,
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
      this.getZone();
      if (!val) this.reset();
    },
    "form.search"() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.refetch();
      }, 500);
    },
    "inputForm.zoneID"() {
      if (this.editInit) {
        this.editInit = false;
      } else {
        this.inputForm.subZoneID = "";
      }
      this.getSubZone();
    },
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    cn,
    buttonVariants,
    async fetchItems() {
      try {
        this.loading = true;
        const { customers } = await this.$api.get(
          "/dashboard/customer",
          this.form
        );
        this.items.push(...customers);
        this.loaded = this.items.length === this.form.perPage;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getZone() {
      try {
        if (this.zoneLoaded) return;
        const { zones } = await this.$api.get("/dashboard/customer/zone");
        this.zones = zones;
      } catch (error) {
        console.error(error);
      } finally {
        this.zoneLoaded = true;
      }
    },
    async getSubZone() {
      try {
        const { subZones } = await this.$api.get(
          "/dashboard/customer/sub-zone",
          { zoneID: this.inputForm.zoneID }
        );
        this.subZones = subZones;
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      this.submitLoading = true;
      try {
        if (this.editMode) {
          await this.$api.put(`/dashboard/customer`, this.inputForm);
        } else {
          await this.$api.post("/dashboard/customer", this.inputForm);
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
        package: "",
        address: "",
        zoneID: "",
        subZoneID: "",
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
    editCustomer(i) {
      this.editInit = true;
      this.editMode = true;
      this.inputForm = this.items[i];
      this.modal = true;
    },
    async deleteCustomer(i) {
      try {
        if (!this.isOwner) return;
        if (!confirm(`Are you sure you want to delete this customer?`)) return;
        await this.$api.post(`/dashboard/customer/delete`, {
          customer: this.items[i],
        });
        this.items.splice(i, 1);
      } catch (error) {
        console.error(error);
      }
    },
    createComplain(i) {
      this.complain.form.user = this.items[i].id;
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
        formData.append("description", this.complain.form.description);
        formData.append("user", this.complain.form.user);
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
    copyID(id) {
      try {
        navigator.clipboard.writeText(id);
        toast.success("ID copied to clipboard");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
