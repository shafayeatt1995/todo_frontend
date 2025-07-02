import { toast } from "vue-sonner";

export const useApi = () => {
  const { cookieParse } = useUtils();
  const config = useRuntimeConfig();
  const API_URL = config.public.API_URL;

  const api = {
    async request(
      method,
      url,
      jsonBody = null,
      formData = null,
      params = null
    ) {
      let token = null;
      if (typeof window === "undefined") {
        const cookie = useRequestHeaders(["cookie"])?.cookie;
        if (cookie) {
          const parse = cookieParse(cookie);
          token = parse?.sessionToken || null;
        }
      } else {
        const parse = cookieParse();
        token = parse?.sessionToken || null;
      }
      const headers = {
        ...(formData ? {} : { "Content-Type": "application/json" }),
        ...(token
          ? token.startsWith("Bearer")
            ? { Authorization: token }
            : { Authorization: `Bearer ${token}` }
          : {}),
      };
      // const headers = {
      //   "Content-Type": "application/json",
      //   ...(token
      //     ? token.startsWith("Bearer")
      //       ? { Authorization: token }
      //       : { Authorization: `Bearer ${token}` }
      //     : {}),
      // };

      const options = {
        method,
        headers,
        body: formData || (jsonBody && JSON.stringify(jsonBody)),
      };

      const query = params ? `?${new URLSearchParams(params)}` : "";
      try {
        return await $fetch(API_URL + url + query, options);
      } catch (error) {
        if (error?.status === 403) {
          toast.error("You are not authorized.");
        }
        throw error; // rethrow so the calling code can still handle it
      }
    },

    get(url, params) {
      return this.request("GET", url, null, null, params);
    },

    post(url, jsonBody = null, formData = null) {
      return this.request("POST", url, jsonBody, formData);
    },

    put(url, jsonBody = null, formData = null) {
      return this.request("PUT", url, jsonBody, formData);
    },

    delete(url, params) {
      return this.request("DELETE", url, null, null, params);
    },
  };
  return { api };
};
