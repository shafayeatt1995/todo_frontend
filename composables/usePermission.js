export const usePermission = () => {
  const { authUser } = useAuth();
  const isAdmin = computed(() => authUser.value?.isAdmin || false);
  const isOwner = computed(() => authUser.value?.isOwner || false);
  const isStaff = computed(() => authUser.value?.isStaff || false);

  return { isAdmin, isOwner, isStaff };
};
