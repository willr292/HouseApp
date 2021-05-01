import React from "react";
import { FileError } from "react-dropzone";
import { FileHeader } from "./FileHeader";
import { Text } from "@chakra-ui/react";

export interface UploadErrorProps {
  file: File;
  onDelete: (file: File) => void;
  errors: FileError[];
}

export function UploadError({ file, onDelete, errors }: UploadErrorProps) {
  return (
    <React.Fragment>
      <FileHeader file={file} onDelete={onDelete} />
      {errors.map((error) => (
        <div key={error.code}>
          <Text color="tomato">{error.message}</Text>
        </div>
      ))}
    </React.Fragment>
  );
}
