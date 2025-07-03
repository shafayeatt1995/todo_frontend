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
    </div>
    <!-- <Dialog v-model:open="modal">
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
    </Dialog> -->
  </Dashboard>
</template>

<script>
import { ContactIcon, PlusIcon } from "lucide-vue-next";

export default {
  name: "User",
  components: {
    ContactIcon,
    PlusIcon,
  },
};
</script>
