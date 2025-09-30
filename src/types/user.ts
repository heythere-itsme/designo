import { combinedSlug } from "@/lib/utils";

export type ConvexUserRaw = {
  _creationTime: number;
  _id: string;
  email: string;
  emailVerificationTime?: number | null;
  name?: string | null;
  imageUrl?: string | null;
};
export type Profile = {
  id: string;
  email: string;
  emailVerifiedAtMs?: number;
  name: string | null;
  imageUrl?: string;
  createdAtMs: number;
};

export const normalizeProfile = (raw: ConvexUserRaw | null): Profile | null => {
  if (!raw) return null;
  const extractNameFromEmail = (email: string) => {
    const username = email.split("@")[0];
    return username
      .split(/[._]/)
      .map(
        (part) => part.charAt(0).toUpperCase() + part.slice(1).toLocaleLowerCase
      )
      .join(" ");
  };

  const name = combinedSlug(raw.name!) || extractNameFromEmail(raw.email);

  return {
    id: raw._id,
    email: raw.email,
    emailVerifiedAtMs: raw.emailVerificationTime || undefined,
    createdAtMs: raw._creationTime,
    imageUrl: raw.imageUrl || undefined,
    name
  }
};
