import { UserDto } from "@/core/application/users/dtos/create-user.dto";

export type LicenseScope = "per-person" | "per-n-persons" | "per-seat";

export type UserLicense = {
  id: string;
  softwareName: string;
  vendor: string;
  monthlyCost: number;
  currency: "EUR" | "USD";
  billingCycle: "monthly" | "yearly";
  status: "active" | "inactive";
  startedAt: string;
  /** Type de licence : par personne, pour n personnes, ou par siège */
  scope: LicenseScope;
  /** Nombre de personnes couvertes (uniquement si scope === "per-n-persons") */
  maxPersons?: number;
};

const baseLicenses: UserLicense[] = [
  {
    id: "notion-basic",
    softwareName: "Notion",
    vendor: "Notion Labs",
    monthlyCost: 8,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2023-01-10",
    scope: "per-person",
  },
  {
    id: "slack-pro",
    softwareName: "Slack",
    vendor: "Slack Technologies",
    monthlyCost: 7.5,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2022-11-05",
    scope: "per-seat",
  },
  {
    id: "linear-standard",
    softwareName: "Linear",
    vendor: "Linear",
    monthlyCost: 10,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2023-03-01",
    scope: "per-n-persons",
    maxPersons: 5,
  },
];

const adminExtras: UserLicense[] = [
  {
    id: "aws-console",
    softwareName: "AWS Console",
    vendor: "Amazon Web Services",
    monthlyCost: 25,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2022-09-15",
    scope: "per-seat",
  },
  {
    id: "datadog-full",
    softwareName: "Datadog",
    vendor: "Datadog",
    monthlyCost: 30,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2022-10-01",
    scope: "per-n-persons",
    maxPersons: 10,
  },
];

const memberExtras: UserLicense[] = [
  {
    id: "figma-pro",
    softwareName: "Figma",
    vendor: "Figma",
    monthlyCost: 12,
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    startedAt: "2023-05-20",
    scope: "per-person",
  },
];

export function getUserLicensesMock(user: UserDto): UserLicense[] {
  if (user.role === "admin") {
    return [...baseLicenses, ...adminExtras];
  }

  if (user.role === "member") {
    return [...baseLicenses, ...memberExtras];
  }

  // reader ou autre rôle : set plus léger
  return baseLicenses;
}

export function getUserLicensesMonthlyTotal(licenses: UserLicense[]): number {
  return licenses.reduce((sum, license) => sum + license.monthlyCost, 0);
}

export function getAllLicensesMock(): UserLicense[] {
  const all = [...baseLicenses, ...adminExtras, ...memberExtras];
  const byId = new Map<string, UserLicense>();

  for (const license of all) {
    if (!byId.has(license.id)) {
      byId.set(license.id, license);
    }
  }

  return Array.from(byId.values());
}
