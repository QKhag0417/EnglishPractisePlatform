import { buildImageUrl } from ".";

type AvatarMeta = {
  initials: string;
  colorClass: string;
  avatarUrl: string;
};

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
] as const;

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = firstName?.trim() ?? "";
  const last = lastName?.trim() ?? "";

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    const parts = first.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return first[0].toUpperCase();
  }

  if (last) {
    return last[0].toUpperCase();
  }

  return "?";
}

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getAvatarColor(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const fullName =
    `${firstName?.trim() ?? ""} ${lastName?.trim() ?? ""}`.trim();

  if (!fullName) {
    return "bg-gray-500";
  }

  const hash = hashString(fullName);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function getAvatarMeta(
  firstName?: string | null,
  lastName?: string | null,
  avatarUrl?: string | null,
): AvatarMeta {
  return {
    initials: getInitials(firstName, lastName),
    colorClass: getAvatarColor(firstName, lastName),
    avatarUrl: buildImageUrl(avatarUrl ?? ""),
  };
}
