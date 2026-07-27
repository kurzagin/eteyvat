import { type NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  const session = request.cookies.get("eteyvat_admin_session")?.value;
  if (!session || session !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    const buffer = await request.arrayBuffer();
    
    // Guess basic content type based on extension
    let contentType = "image/png";
    if (filename.toLowerCase().endsWith(".webp")) contentType = "image/webp";
    if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";

    await s3Client.send(
      new PutObjectCommand({
        Bucket: "eteyvat",
        Key: filename,
        Body: Buffer.from(buffer),
        ContentType: contentType,
      })
    );

    const url = `https://cdn.eteyvat.krzgn.xyz/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
