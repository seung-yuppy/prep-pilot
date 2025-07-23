import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("./pages/home.jsx"));
const Join = lazy(() => import("./pages/join.jsx"));
const LogIn = lazy(() => import("./pages/login.jsx"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: "",
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "/join",
          element: <Join />
        },
        {
          path: "/login",
          element: <LogIn />
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
