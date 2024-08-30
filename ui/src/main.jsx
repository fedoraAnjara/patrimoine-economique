import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/Header";
import Patrimoine from "./components/Patrimoine";
import "bootstrap/dist/css/bootstrap.min.css";
import PossessionsTable from "./components/PossessionsTable";
import Create from "./components/Create";
import Edit from "./components/Edit";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/patrimoine",
    element: <Patrimoine />,
  },
  {
    path: "/possession",
    element: <PossessionsTable />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/edit/:libelle",
    element: <Edit />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>,
);
