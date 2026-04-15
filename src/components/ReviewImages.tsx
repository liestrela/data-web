import { useState, type ChangeEvent, type DragEvent } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ReviewImagesProps {
  images?: string[];
  subject: string;
  onUpdateImages: (images: string[]) => void;
}

export function ReviewImages({ images, subject, onUpdateImages }: ReviewImagesProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList) => {
    const newImgURLs = Array.from(files).map((f) => URL.createObjectURL(f));
    onUpdateImages([...(images || []), ...newImgURLs]);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (idx: number) => {
    if (!images) return;

    if (images[idx]) {
      URL.revokeObjectURL(images[idx]);
    }

    const fImgs = images.filter((_, i) => i !== idx);

    onUpdateImages(fImgs);
  };

  return (
    <div className="image-upload">
      <label
        htmlFor={`file-upload-${subject}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: "block",
          padding: "20px",
          border: `2px dashed ${isDragging ? "#666" : "#ccc"}`,
          borderRadius: "8px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragging ? "#f9f9f9" : "transparent",
          color: "#666",
          transition: "all 0.2s ease",
          marginBottom: "16px",
        }}
      >
        <span>{isDragging ? "Solte as imagens aqui..." : "Clique ou arraste imagens aqui"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          id={`file-upload-${subject}`}
          style={{ display: "none" }}
        />
      </label>
      <div className="image-preview">
        {images?.map((url, idx) => (
          <div key={idx}>
            <img
              src={url}
              alt={`Imagem ${idx + 1} de ${subject}`}
              onClick={() => {
                setIndex(idx);
                setOpen(true);
              }}
            />
            <button className="remove-btn" onClick={() => removeImage(idx)}>
              x
            </button>
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images?.map((url) => ({ src: url }))}
        index={index}
      />
    </div>
  );
}