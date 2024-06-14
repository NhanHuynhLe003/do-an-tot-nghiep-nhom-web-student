import { useQuery } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";

const fetchData = async (params) => {
  const { data } = await axiosInstance.get("/api/data", { params });
  return data;
};

const postData = async ({ endpoint, body }) => {
  const { data } = await axiosInstance.post(endpoint, body, {
    headers: {
      "x-api-key":
        "640dec9df23fbf3255079f3f7d375a9ea119dd0779a60538bf81b18aff28512ad44b4a911a78a53ead753401ad7eabbc0864472e10d4ae55667ddc6a3bedcafd",
    },
  });
  return data;
};

// const useFetchData = () => {
//   return useQuery("data", fetchData);
// };

const useLoginUser = () => {
  return useQuery("login", postData);
};

export { useLoginUser };
