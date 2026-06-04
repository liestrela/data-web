import { useState, type ChangeEvent, type DragEvent } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useAuth } from "../context/AuthContext";

interface ReviewImagesProps {
  images?: string[];
  subject: string;
  onUpdateImages: (images: string[]) => void;
}

export function ReviewImages({
  images,
  subject,
  onUpdateImages,
}: ReviewImagesProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { authToken } = useAuth();

  const processFiles = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:3001/api/upload/store", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateImages([...(images || []), ...data.urls]);
      } else {
        console.error("Erro ao fazer upload das imagens");
      }
    } catch (error) {
      console.error("Erro na requisição de upload", error);
    }
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

  const removeImage = async (idx: number) => {
    if (!images) return;

    const imageUrl = images[idx];
    if (imageUrl) {
      try {
        await fetch("http://localhost:3001/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ imageUrl }),
        });
      } catch (error) {
        console.error("Erro ao deletar a imagem", error);
      }
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
        <span>
          {isDragging
            ? "Solte as imagens aqui..."
            : "Clique ou arraste imagens aqui"}
        </span>
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

export default ReviewImages;
