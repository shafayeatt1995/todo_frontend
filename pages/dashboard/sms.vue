<template>
  <Head>
    <Title>SMS - Dashboard</Title>
  </Head>
  <Dashboard>
    <Tabs :defaultValue="selectTab" class="w-full overflow-hidden">
      <div class="w-full overflow-x-auto whitespace-nowrap">
        <TabsList class="w-full flex gap-2 min-w-max">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            >{{ tab.label }}</TabsTrigger
          >
        </TabsList>
      </div>
      <TabsContent value="report">
        <Card>
          <CardHeader>
            <CardTitle>SMS Report</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2"> </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="bill">
        <Card>
          <CardHeader>
            <CardTitle class="flex justify-between">
              <p>Bill SMS</p>
              <Switch :defaultValue="true" />
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2"> </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="custom">
        <SMSCustom />
      </TabsContent>
    </Tabs>
  </Dashboard>
</template>

<script>
export default {
  name: "SMS",
  data() {
    return {
      selectTab: "custom",
      tabs: [
        { value: "report", label: "SMS Report" },
        { value: "bill", label: "Bill SMS" },
        { value: "custom", label: "Custom SMS" },
      ],
    };
  },
};
</script>
