import { SoftCard } from "@/components/shared/SoftCard";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <SoftCard className="p-8">
        <div className="skeleton h-5 w-40 rounded" />
        <div className="skeleton h-7 w-3/4 rounded mt-3" />
        <div className="skeleton h-3 w-full rounded mt-6" />
        <div className="skeleton h-3 w-full rounded mt-3" />
      </SoftCard>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SoftCard key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-12 w-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-5 w-1/2 rounded" />
              </div>
            </div>
          </SoftCard>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SoftCard key={i} className="p-5">
            <div className="skeleton h-12 w-12 rounded-2xl" />
            <div className="skeleton h-4 w-3/4 rounded mt-4" />
            <div className="skeleton h-2 w-full rounded mt-4" />
          </SoftCard>
        ))}
      </div>
    </div>
  );
}
