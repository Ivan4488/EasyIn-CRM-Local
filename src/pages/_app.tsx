import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { useState } from "react"
import { Toaster } from "~/components/UI/Toast/toaster"

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}
      <Toaster />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default MyApp;
