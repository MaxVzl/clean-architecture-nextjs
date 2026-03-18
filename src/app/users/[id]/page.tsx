import { notFound } from "next/navigation";

import { getUsersUseCase } from "@/factories/users.factories";
import {
  getUserLicensesMock,
  getUserLicensesMonthlyTotal,
} from "@/lib/user-licenses.mock";
import { UserDetailHeader } from "@/components/features/users/user-detail-header";
import { UserLicensesList } from "@/components/features/users/user-licenses-list";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  const users = await getUsersUseCase.execute();
  const user = users.find((u) => u.id === id);

  if (!user) {
    notFound();
  }

  const licenses = getUserLicensesMock(user);
  const monthlyTotal = getUserLicensesMonthlyTotal(licenses);

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <UserDetailHeader user={user} monthlyTotal={monthlyTotal} />
        <UserLicensesList licenses={licenses} groupBySoftware />
      </div>
    </main>
  );
}
