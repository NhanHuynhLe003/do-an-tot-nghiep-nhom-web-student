import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../apis/axiosConfig";
import { UploadKeys } from "../../../constants/ReactQuery/upload";
import { createSlug } from "../../../utils";

export const useUploadImageStatic = (payload, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (imageData) => {
      const file = imageData?.file;
      const formData = new FormData();
      const extension = file?.name.split(".").pop();
      const fileName = file?.name.split(".").shift();
      const fileNameSlug = createSlug(fileName);

      const newFileName = `${fileNameSlug}.${extension}`;
      const renamedFile = new File([file], newFileName, {
        type: file.type,
      });

      formData.append("uploadFileKey", renamedFile);
      const { data } = await axiosInstance.post(
        `/v1/api/upload/static/img?nameStorage=${imageData?.nameStorage}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },

    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: [UploadKeys.GET_IMAGES_BY_USER_ID_AND_NAME_STORAGE],
        });
      },

      ...options,
    }
  );
};
