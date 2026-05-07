import { useState, useEffect } from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  width?: number;
  disableShadow?: boolean;
}

const COLORS = ["#91BDFF", "#7FB2A9", "#B491FE", "#BAB771"];

const getColorBasedOnName = (name: string) => {
  if (!name) return COLORS[0];
  const index = name.charCodeAt(0) % COLORS.length;
  return COLORS[index];
};

function getFirstEmoji(s: string) {
  if (!s) return null;
  // Regular expression to match emoji using Unicode property escapes
  const emojiRegex = /^(\p{Extended_Pictographic})/u;

  // Attempt to match the first character of the string with the emoji regex
  const match = s.match(emojiRegex);

  // If there's a match and it's the first character, return it
  return match ? match[0] : null;
}

export const Avatar = ({ src, alt, width = 32, disableShadow = false }: AvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  const emoji = getFirstEmoji(alt);
  const firstChar = emoji ? emoji : alt ? alt[0]?.toUpperCase() : null;

  // Show fallback if no src or if image failed to load
  if (!src || hasImageError) {
    return (
      <div
        className="bg-[#373E41] font-semibold rounded-full flex justify-center items-center text-display-15 shrink-0"
        style={{
          width: width,
          height: width,
          minWidth: width,
          boxShadow: disableShadow ? "none" : "0px 8px 12px 0px rgba(0, 0, 0, 0.12)",
          color: getColorBasedOnName(alt),
        }}
      >
        {alt && firstChar}
      </div>
    );
  }

  const handleImageError = () => {
    setHasImageError(true);
  };

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className="rounded-full shrink-0"
      style={{ width: width, height: width, minWidth: width }}
      onError={handleImageError}
    />
  );
};
