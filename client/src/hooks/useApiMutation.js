import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../lib/axios";

export function useApiMutation({ keys = [], method = 'post', path = '/', message = null, errorMessage, cb = () => { }, props = {} }) {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({ data=null, path='/'}) => {
      if (!navigator.onLine)
        toast.success("You're offline. Your action will be completed once you're back online.");
      const response = await axiosInstance[method](path, data);
      return response.data;
    },

    // onMutate: async (variables) => {

    //   await queryClient.cancelQueries({ queryKey: ['requests'] });

    //   const previousData = queryClient.getQueryData(['requests']);

    //   const optimisticData = JSON.parse(JSON.stringify(previousData));

    //   if (method === 'delete') {
    //     optimisticData.sent = optimisticData.sent.filter(
    //       (req) => req._id !== variables
    //     );
    //   } else if (method === 'put') {
    //     optimisticData.received = optimisticData.received.map((req) =>
    //       req._id === keys[1] ? { ...req, status: variables.status } : req
    //     );
    //   } else if (method === 'post') {
    //     optimisticData.sent.push(variables);
    //   }

    //   queryClient.setQueryData(['requests'], optimisticData);

    //   return { previousData };
    // },

    onError: (error, _vars, context) => {
      if (navigator.onLine)
        toast.error(error?.response?.data?.message || error?.message || errorMessage || "Something went wrong!");

      // if (context?.previousData)
      //   queryClient.setQueryData(['requests'], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys });
    },

    onSuccess: data => {
      cb(data);
      if (message) toast.success(message);
    },
    ...props
  });
}
