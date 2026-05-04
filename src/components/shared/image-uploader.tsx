import {
  Image,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ImageUploader({ field, isInvalid }: { field: any; isInvalid: boolean }) {
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>(field.state.value);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  async function authenticator() {
    try {
      const response = await fetch("/api/auth/imagekit");

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      const { signature, expire, token, publicKey } = data;

      return { signature, expire, token, publicKey };
    } catch (error) {
      throw new Error("Authentication request failed");
    }
  }

  async function handleUpload() {
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.warning("Please select an image to upload.");

      return;
    }

    const file = fileInput.files[0];

    let authParams;

    try {
      authParams = await authenticator();
    } catch (authError) {
      if (authError instanceof Error) {
        toast.error(`${authError.message} while uploading image.`);
      }

      return;
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        folder: "/eventory",
        abortSignal: abortController.signal,
      });

      toast.success("File uploaded successfully.");
      setImageUrl(uploadResponse.url ?? "");
      field.handleChange(uploadResponse.url);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload aborted.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid request.");
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error.");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error.");
      } else {
        toast.error("An unknown error occurred while uploading the file.");
      }
    }
  }

  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="file-input">Event Image</FieldLabel>

        {imageUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <FieldLabel htmlFor="file-input" className="cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-2xl *:[img]:h-full *:[img]:w-full *:[img]:object-cover">
                  <Image src={imageUrl} />
                </div>
              </FieldLabel>
            </TooltipTrigger>

            <TooltipContent>
              <p>Click to pick an image</p>
            </TooltipContent>
          </Tooltip>
        )}

        <FieldLabel htmlFor="file-input">
          <Input
            id="file-input"
            type="file"
            ref={fileInputRef}
            onChange={() => setProgress(0)}
            accept="image/*"
            className="cursor-pointer"
          />
        </FieldLabel>

        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>

      {progress > 0 && (
        <Field>
          <FieldLabel htmlFor="progress-upload">
            <span>Upload progress</span>
            <span className="ml-auto">{Math.round(progress)}%</span>
          </FieldLabel>

          <Progress value={progress} id="progress-upload" />
        </Field>
      )}

      <Button type="button" onClick={handleUpload} disabled={progress > 0}>
        {progress > 0 && progress < 100 ? <Spinner /> : "Upload Image"}
      </Button>
    </FieldGroup>
  );
}
