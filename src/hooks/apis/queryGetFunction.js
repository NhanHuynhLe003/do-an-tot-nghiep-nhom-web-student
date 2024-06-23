import { useQuery } from "react-query";

/**
 *
 * @param {*} queryKey - Unique Key for query
 * @param {*} callbackQuery - Async Function for query
 * @param {*} options - options useQuery
 * @returns
 */
export const QueryFunction = (queryKey, callbackQuery, options = {}) => {
  return useQuery(
    {
      queryKey: queryKey,
      queryFn: callbackQuery,
    },
    {
      ...options,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      staleTime: 0,
      cacheTime: 0,
    }
  );
};
