import Link from "next/link";
import { ArrowLeft, Construction, Zap } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description
}: PlaceholderPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a10] px-5 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#11121a] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <Construction size={27} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-violet-400">
          <Zap size={16} /> SkillSync
        </div>

        <h1 className="mt-4 text-3xl font-bold">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {description}
        </p>

        <p className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-xs text-violet-300">
          This module is under development. Its functionality will be added next.
        </p>

        <Link
          href="/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
