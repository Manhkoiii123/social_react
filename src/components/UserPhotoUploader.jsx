import {
  useDeletePhotoMutation,
  useUploadPhotoMutation,
} from "@services/userApi";
import Button from "./Button";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UserPhotoUploader = ({
  title,
  footNote,
  currentImgSrc,
  isCover = false,
}) => {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();
  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("isCover", isCover);
    formData.append("image", acceptedFiles[0]);
    uploadPhoto(formData);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: ".jpg,.jpeg,.png",
  });
  return (
    <div>
      <p className="mb-2 font-semibold">{title}</p>
      <div className="flex items-center gap-4">
        <img
          src={currentImgSrc ?? "https://placehold.co/100x100"}
          className="h-24 w-24 rounded object-contain"
        />
        <div>
          <div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button variant="contained" size="small" isLoading={isLoading}>
                Upload new photo
              </Button>
            </div>
          </div>
          <Button
            isLoading={isDeleting}
            size="small"
            onClick={() => {
              deletePhoto(isCover);
            }}
          >
            Reset
          </Button>
          <p className="mt-2 text-sm text-dark-400">{footNote}</p>
        </div>
      </div>
    </div>
  );
};
export default UserPhotoUploader;
