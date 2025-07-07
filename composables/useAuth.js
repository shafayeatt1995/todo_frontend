export const useAuth = () => {
  const authUser = useState("user", () => null);
  const loggedIn = computed(() => !!authUser.value);
  const isAdmin = computed(() => !!authUser.value?.isAdmin);
  const isExpired = computed(() => {
    const exp = authUser.value?.business?.exp;
    return exp ? new Date(exp).getTime() < Date.now() : true;
  });

  const { api } = useApi();
  const { cookieParse, removeCookie, setCookie } = useUtils();

  const setUser = (user) => {
    authUser.value = user;
  };

  const login = async (user, t) => {
    try {
      const token = t || (await api.post("/auth/login", user))?.data?.token;
      setCookie("sessionToken", token, { expires: 30 });

      const { user } = await api.get("/user");
      setUser(user);
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Custom login (anikerLogin)
  const anikerLogin = async (body) => {
    try {
      const data = await api.post("/auth/aniker-login", body);
      setUser(data.user);
      setCookie("sessionToken", data.token, { expires: 7 });
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Fetch authenticated user from API if cookie token exists
  const fetchUser = async () => {
    try {
      if (!authUser.value) {
        let cookie = document.cookie || null;
        if (cookie && cookieParse(cookie)?.sessionToken) {
          const { user } = await api.get("/user");
          setUser(user);
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Logout function: clear cookie and reset user state
  const logout = (redirect = "/") => {
    removeCookie("sessionToken");
    setUser(null);
    navigateTo(redirect);
  };

  // Refresh token and update user & cookie
  const refreshToken = async () => {
    try {
      const { user, token } = await api.get("/user/refresh-token");
      setUser(user);
      setCookie("sessionToken", token, { expires: 30 });
      return { user, token };
    } catch (err) {
      console.error(err);
    }
  };

  return {
    authUser,
    loggedIn,
    login,
    anikerLogin,
    fetchUser,
    logout,
    refreshToken,
    isAdmin,
    isExpired,
  };
};
