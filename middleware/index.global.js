export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { path } = to;
  const guest = ["/"];
  const authExactUrls = [];
  const authStartsWithRoutes = ["/dashboard"];

  const { fetchUser, authUser } = useAuth();
  await fetchUser();

  const isExactRoute = authExactUrls.includes(path);
  const isStartsRoute = authStartsWithRoutes.some((route) =>
    path.startsWith(route)
  );
  if (!(isExactRoute || isStartsRoute)) {
    if (guest.includes(path)) {
      if (authUser.value) {
        return navigateTo("/dashboard");
      }
    }
  }
  if (isExactRoute || isStartsRoute) {
    if (!authUser.value) return navigateTo("/");
  }
});
