<template>
  <Head>
    <Title>Purchase History - Dashboard</Title>
  </Head>
  <Dashboard>
    <div class="w-full space-y-2">
      <h1 class="flex gap-2 items-center text-2xl font-bold">
        <DollarSignIcon /> Purchase History
      </h1>
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
                  @click="sort('package')"
                >
                  <p>Package</p>
                  <Sort :value="form.sort.package" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('amount')"
                >
                  <p>Amount</p>
                  <Sort :value="form.sort.amount" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('trxID')"
                >
                  <p>Transaction ID</p>
                  <Sort :value="form.sort.trxID" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('payerNumber')"
                >
                  <p>Payment Number</p>
                  <Sort :value="form.sort.payerNumber" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('sms')"
                >
                  <p>SMS count</p>
                  <Sort :value="form.sort.sms" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex gap-2 items-center cursor-pointer"
                  @click="sort('createdAt')"
                >
                  <p>Purchase Date</p>
                  <Sort :value="form.sort.createdAt" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(pack, i) in loading ? 10 : items" :key="i">
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.package }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.amount }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.trxID }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.payerNumber }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ pack.sms }}</span>
              </TableCell>
              <TableCell>
                <Skeleton class="w-full h-5 rounded-full" v-if="loading" />
                <span v-else>{{ $date(pack.createdAt) }}</span>
              </TableCell>
            </TableRow>
            <TableRow v-if="!loading && items.length === 0">
              <TableCell :colspan="3" class="h-24 text-center">
                <div class="flex flex-col items-center justify-center py-10">
                  <BookOpenIcon :size="50" />
                  <p>No results found.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </Dashboard>
</template>

<script>
import {
  BookOpenIcon,
  MoreHorizontalIcon,
  DollarSignIcon,
} from "lucide-vue-next";

export default {
  name: "PurchaseHistory",
  components: {
    BookOpenIcon,
    MoreHorizontalIcon,
    DollarSignIcon,
  },
  data() {
    return {
      perPageOptions: [25, 50, 100],
      searchByOptions: ["trxID"],
      form: {
        page: 1,
        perPage: 25,
        keyword: "",
        searchBy: "trxID",
        sort: { _id: -1 },
      },
      items: [],
      total: 0,
      loading: true,
      init: false,
      debounceTimer: null,
    };
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
        const { purchases, total } = await this.$api.post(
          `/dashboard/purchase`,
          this.form
        );
        this.items = purchases;
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
    refetch() {
      if (this.form.page == 1) {
        this.fetchItems();
      } else {
        this.form.page = 1;
      }
    },
  },
};
</script>
