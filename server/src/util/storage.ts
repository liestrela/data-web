import { S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";

const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const minioPort = process.env.MINIO_PORT || "9000";

const s3Client = new S3Client({
  endpoint: `http://${minioEndpoint}:${minioPort}`,
  region: "us-east-1", // região dummy para minio
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "cards-images";
const PUBLIC_MINIO_URL = `http://localhost:${minioPort}/${BUCKET_NAME}`;

async function initStorage() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`[Storage] O bucket '${BUCKET_NAME}' já existe.`);
  } catch (error: any) {
    if (error.name === "NotFound" || error.name === "NoSuchBucket" || error.$metadata?.httpStatusCode === 404) {
      console.log(`[Storage] O bucket '${BUCKET_NAME}' não existe. Criando...`);
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`[Storage] Bucket '${BUCKET_NAME}' criado com sucesso.`);
        
        // Configurar política de leitura pública
        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
            },
          ],
        };

        await s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: BUCKET_NAME,
            Policy: JSON.stringify(policy),
          })
        );
        console.log(`[Storage] Política do bucket '${BUCKET_NAME}' definida para leitura pública.`);

      } catch (createError) {
        console.error(`[Storage] Erro ao criar o bucket '${BUCKET_NAME}':`, createError);
      }
    } else {
      console.error(`[Storage] Erro ao verificar o bucket '${BUCKET_NAME}':`, error);
    }
  }
}

export { s3Client, BUCKET_NAME, PUBLIC_MINIO_URL, initStorage };