import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
