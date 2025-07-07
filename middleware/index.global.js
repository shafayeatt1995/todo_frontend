export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { path } = to;
  const guest = ["/"];
  const authExactUrls = [];
  const authStartsWithRoutes = ["/admin", "/dashboard"];

  const { fetchUser, authUser } = useAuth();
  await fetchUser();

  const isExactRoute = authExactUrls.includes(path);
  const isStartsRoute = authStartsWithRoutes.some((route) =>
    path.startsWith(route)
  );
  if (!(isExactRoute || isStartsRoute)) {
    if (guest.includes(path)) {
      if (authUser.value) {
        if (authUser.value.isAdmin) {
          return navigateTo("/admin");
        } else {
          return navigateTo("/dashboard");
        }
      }
    }
  }
  if (isExactRoute || isStartsRoute) {
    if (!authUser.value) return navigateTo("/");
  }
  if (path.startsWith("/dashboard") && authUser.value?.isAdmin) {
    return navigateTo("/admin");
  }
  if (path.startsWith("/admin") && !authUser.value?.isAdmin) {
    return navigateTo("/dashboard");
  }
  const isOnDashboard = path.startsWith("/dashboard");
  const isOnPurchasePage = path.startsWith("/dashboard/purchase");
  const isBusinessExpired =
    authUser.value?.business?.exp &&
    new Date(authUser.value.business.exp).getTime() < Date.now();

  if (
    isOnDashboard &&
    !isOnPurchasePage &&
    authUser.value &&
    !authUser.value.isAdmin &&
    isBusinessExpired
  ) {
    return navigateTo("/dashboard/purchase");
  }
});
