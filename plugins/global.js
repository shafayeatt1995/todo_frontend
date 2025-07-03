const formatDate = (value, options) =>
  new Date(value).toLocaleString("en-US", options);

export default defineNuxtPlugin((nuxtApp) => {
  const { api } = useApi();
  nuxtApp.provide("api", api);

  // December 27, 2024 at 05:37:48 PM
  nuxtApp.provide("date", (value) =>
    formatDate(value, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  // December 27, 2024
  nuxtApp.provide("normalDate", (value) =>
    formatDate(value, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // Dec 27, 2024
  nuxtApp.provide("shortDate", (value) =>
    formatDate(value, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  // 12/27/2024, 05:37:48 PM
  nuxtApp.provide("normalDate2", (value) =>
    formatDate(value, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );
  // Friday, December 27, 2024 at 05:37:48 PM
  nuxtApp.provide("fullDate", (value) =>
    formatDate(value, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "long",
      hour12: true,
    })
  );
  // 2 days ago
  nuxtApp.provide("agoDate", (value) => {
    const now = new Date();
    const then = new Date(value);
    const diff = Math.abs(now.getTime() - then.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  });
  nuxtApp.provide("year", (value) => new Date(value).getFullYear());
  nuxtApp.provide("numberFloat", (value) => parseFloat(value).toFixed(2));
  nuxtApp.provide("number", (value) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  nuxtApp.provide("currencyNumber", (value) => value.toLocaleString("en-IN"));
  nuxtApp.provide("mathRound", (value) => Math.round(value));
});
