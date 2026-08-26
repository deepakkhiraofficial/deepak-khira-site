import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // =========================================================
    // FORM DATA
    // =========================================================

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file uploaded.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // FILE VALIDATION
    // =========================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid image format. JPG, PNG, WEBP or GIF allowed.",
        },
        { status: 400 }
      );
    }

    // Maximum 5 MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5MB.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // CONVERT FILE → BUFFER
    // =========================================================

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // =========================================================
    // CLOUDINARY UPLOAD
    // =========================================================

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      format?: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    // =========================================================
    // SUCCESS
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully.",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PRODUCT IMAGE UPLOAD ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Image upload failed.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}