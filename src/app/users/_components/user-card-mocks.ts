import { Role } from "@/core/domain/users/enums/role.enum";

const GRADIENT_RING = [
  "from-violet-500 to-fuchsia-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
] as const;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getMockedUserExtras(id: string) {
  const h = hashId(id);
  return {
    avatarSeed: id,
    emailVerified: h % 2 === 0,
    gradientRing: GRADIENT_RING[h % GRADIENT_RING.length],
  };
}

export function roleLabelFr(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "Administrateur";
    case Role.USER:
      return "Utilisateur";
  }
}

export function dicebearAvatarUrl(seed: string): string {
  const params = new URLSearchParams({ seed });
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}
