import { Trophy } from "lucide-react";
import { SoftCard } from "@/components/shared/SoftCard";
import { cn } from "@/lib/utils";

type Entry = { rank: number; name: string; xp: number; avatar: string };

const medal = (rank: number) => {
  if (rank === 1) return "bg-amber-100 text-amber-600";
  if (rank === 2) return "bg-slate-100 text-slate-500";
  if (rank === 3) return "bg-orange-100 text-orange-600";
  return "bg-purple-50 text-purple-500";
};

export function ArenaRanking({
  leaderboard,
  myRank,
}: {
  leaderboard: Entry[];
  myRank: Entry;
}) {
  return (
    <SoftCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" /> Arena Ranking
          </p>
          <p className="font-display font-bold text-slate-800 mt-0.5">This week's top</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {leaderboard.map((e) => (
          <li key={e.rank} className="flex items-center gap-3">
            <span
              className={cn(
                "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold",
                medal(e.rank),
              )}
            >
              {e.rank}
            </span>
            <img src={e.avatar} alt="" className="h-8 w-8 rounded-full bg-slate-100" />
            <span className="text-sm font-semibold text-slate-800 flex-1 truncate">
              {e.name}
            </span>
            <span className="text-xs font-bold text-slate-500">{e.xp} XP</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
        <div className="flex items-center gap-3 p-2.5 -mx-1 rounded-xl bg-purple-50">
          <span className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold bg-purple-500 text-white">
            {myRank.rank}
          </span>
          <img src={myRank.avatar} alt="" className="h-8 w-8 rounded-full" />
          <span className="text-sm font-semibold text-slate-800 flex-1 truncate">
            You
          </span>
          <span className="text-xs font-bold text-purple-600">{myRank.xp} XP</span>
        </div>
      </div>
    </SoftCard>
  );
}
