import type { Request, Response } from "express";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME, PUBLIC_MINIO_URL } from "@/util/storage";
import crypto from "crypto";

const sanitizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_.]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);

export const storeUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const dotIdx = file.originalname.lastIndexOf(".");
      const ext = dotIdx !== -1 ? file.originalname.slice(dotIdx + 1) : "";
      const baseName = dotIdx !== -1 ? file.originalname.slice(0, dotIdx) : file.originalname;
      const safeName = sanitizeName(baseName);
      const uniqueFileName = `${safeName}-${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: uniqueFileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      uploadedUrls.push(`${PUBLIC_MINIO_URL}/${uniqueFileName}`);
    }

    res.status(200).json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Erro no processamento do upload:", error);
    res.status(500).json({ error: "Falha interna ao processar o upload dos arquivos" });
  }
};

export const removeUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "A URL do arquivo é obrigatória para exclusão" });
      return;
    }

    const key = imageUrl.replace(`${PUBLIC_MINIO_URL}/`, "");

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    res.status(200).json({ message: "Arquivo removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar arquivo do MinIO:", error);
    res.status(500).json({ error: "Falha interna ao deletar o arquivo do storage" });
  }
};