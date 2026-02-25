import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

interface ProsAndConsProps {
  prosAndCons: { pros: string[]; cons: string[] } | null;
}

export function ProsAndCons({ prosAndCons }: ProsAndConsProps) {
  if (!prosAndCons) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-green-700">
          <CheckCircle2Icon className="size-5" />
          Pros
        </h3>
        <ul className="space-y-2">
          {prosAndCons.pros.map((pro) => (
            <li
              key={pro}
              className="flex items-start gap-2 text-sm text-green-800"
            >
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-green-500" />
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-700">
          <XCircleIcon className="size-5" />
          Cons
        </h3>
        <ul className="space-y-2">
          {prosAndCons.cons.map((con) => (
            <li
              key={con}
              className="flex items-start gap-2 text-sm text-red-800"
            >
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-red-500" />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
