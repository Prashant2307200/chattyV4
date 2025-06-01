import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnReconnect: true,
  //     staleTime: 1000 * 60 * 10, 
  //     gcTime: 1000 * 60 * 10,
  //     refetchOnMount: true,
  //     refetchOnWindowFocus: true,
  //     retry: 1
  //   },
  //   mutations: {
  //     retry: 1
  //   }
  // }
});

export const TanStackQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)