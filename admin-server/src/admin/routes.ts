import CustomPage from "./routes/custom/page";

const routes = [
  {
    path: "/a/custom",
    component: CustomPage,
    exact: true, // You can set it to true if you want an exact match for the path
  },
  // You can add more routes here if needed
];

export default routes;
