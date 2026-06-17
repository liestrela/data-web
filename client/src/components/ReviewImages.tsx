import { useState, type ChangeEvent, type DragEvent } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useAuth } from "../context/AuthContext";

interface ReviewImagesProps {
  attachments?: string[];
  subject: string;
  onUpdateAttachments: (attachments: string[]) => void;
}

type ImageSlide = { src: string };
type PdfSlide = { type: "pdf"; href: string; title: string };
type Slide = ImageSlide | PdfSlide;

const isPdf = (url: string) =>
  (url.toLowerCase().split("?")[0] ?? "").endsWith(".pdf");

const getFilename = (url: string) => {
  const raw = url.split("/").pop() ?? "";
  return decodeURIComponent(raw.split("?")[0] || "documento.pdf");
};

const PdfFileIcon = ({ lightbox = false }: { lightbox?: boolean }) => {
  const color = lightbox ? "#7a3030" : "#e74c3c";
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="9" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="17" x2="15" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
};


export function ReviewImages({
  attachments,
  subject,
  onUpdateAttachments,
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
        onUpdateAttachments([...(attachments || []), ...data.urls]);
      } else {
        console.error("Erro ao fazer upload dos arquivos");
      }
    } catch (error) {
      console.error("Erro na requisição de upload", error);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  const removeFile = async (idx: number) => {
    if (!attachments) return;

    const imageUrl = attachments[idx];
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
        console.error("Erro ao deletar o arquivo", error);
      }
    }

    onUpdateAttachments(attachments.filter((_, i) => i !== idx));
  };

  const slides: Slide[] = (attachments || []).map((url) =>
    isPdf(url)
      ? { type: "pdf", href: url, title: getFilename(url) }
      : { src: url }
  );

  const handleItemClick = (idx: number) => {
    setIndex(idx);
    setOpen(true);
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
            ? "Solte os arquivos aqui..."
            : "Clique ou arraste arquivos aqui"}
        </span>
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileUpload}
          id={`file-upload-${subject}`}
          style={{ display: "none" }}
        />
      </label>
      <div className="image-preview">
        {attachments?.map((url, idx) => (
          <div key={idx} className={isPdf(url) ? "pdf-item" : undefined}>
            {isPdf(url) ? (
              <div className="pdf-thumb" onClick={() => handleItemClick(idx)}>
                <PdfFileIcon />
                <span>{getFilename(url)}</span>
              </div>
            ) : (
              <img
                src={url}
                alt={`Imagem ${idx + 1} de ${subject}`}
                onClick={() => handleItemClick(idx)}
              />
            )}
            <button className="remove-btn" onClick={() => removeFile(idx)}>
              x
            </button>
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slides={slides as any}
        index={index}
        render={{
          slide: ({ slide }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const s = slide as unknown as PdfSlide;
            if (s.type !== "pdf") return undefined;
            return (
              <div className="pdf-lightbox-slide">
                <div className="pdf-lightbox-card">
                  <PdfFileIcon lightbox />
                  <span className="pdf-lightbox-title">{s.title}</span>
                  <a
                    href={s.href}
                    download={s.title}
                    className="pdf-lightbox-download"
                  >
                    Baixar PDF
                  </a>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}

export default ReviewImages;
