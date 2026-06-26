import React, {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import "./ImageUploader.css";

interface UploadImageProps {
  onImageSelect?: (file: File | null) => void;
  maxSizeMB?: number;
}

export default function UploadImage({
  onImageSelect,
  maxSizeMB = 5,
}: UploadImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to process the selected file
  const handleFile = (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxSizeMB}MB.`);
      return;
    }

    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file back to parent form state if callback exists
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  // Handle standard input selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Remove current selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering container click
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onImageSelect) onImageSelect(null);
  };

  return (
    <div className="upload-container">
      <label className="upload-label">Project Cover Image</label>

      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""} ${previewUrl ? "has-preview" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden-file-input"
        />

        {previewUrl ? (
          <div className="preview-wrapper">
            <img src={previewUrl} alt="Preview" className="image-preview" />
            <button type="button" className="clear-btn" onClick={handleClear}>
              &times;
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <svg
              className="upload-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <span>PNG, JPG, or WEBP (Max {maxSizeMB}MB)</span>
          </div>
        )}
      </div>

      {error && <span className="upload-error-message">{error}</span>}
    </div>
  );
}
