import Container from "@mui/material/Container";

import { Header, UserInfo } from "./components";
import { Home, FullPost, Registration, AddPost, Login, Root } from "./pages";
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";

import { postLoader } from "./pages/FullPost";
import ErrorPage from "./pages/error-page";
import { authAction } from "./pages/Login";
import { checkAuthLoader} from "./helpers/jwt";
import { addPostAction } from "./pages/AddPost";
import { EditPost, editPostAction, editPostLoader } from "./pages/EditPost";
import { authControl } from "./hooks/authHook";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    id: "root",
    errorElement: <ErrorPage />,
    loader: authControl,
    children: [
      { path: "/", element: <Home /> },
      { path: "auth/register", element: <Registration />, action: authAction },
       { path: "auth/login", element: <Login />, action: authAction },
       { path: "posts/:id", element: <FullPost />, loader: postLoader },
       { path: "posts/create", element: <AddPost />, loader: checkAuthLoader, action: addPostAction },
       { path: "posts/:id/edit", element: <EditPost />, loader: editPostLoader, action: editPostAction }
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;