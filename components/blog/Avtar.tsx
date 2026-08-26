interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  name,
  size = 32,
  className = "",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const gradients = [
    "linear-gradient(135deg,#4f46e5,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#10b981,#3b82f6)",
    "linear-gradient(135deg,#8b5cf6,#ec4899)",
    "linear-gradient(135deg,#facc15,#f97316)",
  ];
  const bgGradient = gradients[name.length % gradients.length];

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold text-sm ${className}`}
      style={{ width: size, height: size, background: bgGradient }}
      title={name}
    >
      {initials}
    </div>
  );
}
