import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Write from "./pages/write.jsx";
import BaseLayout from "./layout/baseLayout.jsx";

const Home = lazy(() => import("./pages/home.jsx"));
const Join = lazy(() => import("./pages/join.jsx"));
const LogIn = lazy(() => import("./pages/login.jsx"));
const Post = lazy(() => import("./pages/post.jsx"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BaseLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        // {
        //   path: "/join",
        //   element: <Join />
        // },
        // {
        //   path: "/login",
        //   element: <LogIn />
        // },
        {
          path: "/write",
          element: <Write />
        },
        {
          path: "/post/:id",
          element: <Post />
        }
      ]
    }
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App
