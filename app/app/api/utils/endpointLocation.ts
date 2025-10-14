export const getBaseUrl = () =>
  process.env.NODE_ENV === "production" ? "train_dashboard_api" : "localhost";
