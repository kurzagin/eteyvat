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
  const kind = searchParams.get("kind") || "misc";
  const slug = searchParams.get("slug") || "unknown";

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    const buffer = await request.arrayBuffer();
    
    // Guess basic content type based on extension
    const extension = filename.split('.').pop()?.toLowerCase() || 'png';
    let contentType = "image/png";
    if (extension === "webp") contentType = "image/webp";
    if (extension === "jpg" || extension === "jpeg") contentType = "image/jpeg";

    const key = `${kind}/${slug}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: "eteyvat",
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: contentType,
      })
    );

    const url = `https://cdn.eteyvat.krzgn.xyz/${key}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
