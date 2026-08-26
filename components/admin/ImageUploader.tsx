"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">Product Image</label>
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-48 h-48 object-cover rounded-lg border"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={loading}
        className="mt-2"
      />
      {loading && <p className="text-gray-500">Uploading...</p>}
    </div>
  );
}
