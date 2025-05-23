import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, 
      gcTime: 1000 * 60 * 10,
      // refetchOnMount: true,
      // refetchOnWindowFocus: true,
      // refetchOnReconnect: true,
      retry: 1
    },
    mutations: {
      retry: 1
    }
  }
})

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)