import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const BaseLayout = lazy(() => import("./layout/baseLayout.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Write = lazy(() => import("./pages/write.jsx"));
const Post = lazy(() => import("./pages/post.jsx"));
const MyPage = lazy(() => import("./pages/mypage.jsx"));


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
        {
          path: "/write",
          element: <Write />
        },
        {
          path: "/post/:id",
          element: <Post />
        },
        {
          path: "/mypage",
          element: <MyPage />
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
