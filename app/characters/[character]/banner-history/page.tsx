import { getDatabase } from "@/db/client";
import { bannerCharacterStatistics, entities, bannerPhaseCharacters, bannerPhases } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CharacterBannerHistoryPage({
  params
}: {
  params: { character: string }
}) {
  const db = getDatabase();
  
  const charEntity = await db.query.entities.findFirst({
    where: eq(entities.slug, params.character),
  });

  if (!charEntity) {
    notFound();
  }

  const appearances = await db
    .select({
      phaseKey: bannerPhases.phaseKey,
      version: bannerPhases.version,
      phaseNumber: bannerPhases.phaseNumber,
      sequenceIndex: bannerPhases.sequenceIndex,
      startDate: bannerPhases.startDate,
      endDate: bannerPhases.endDate,
    })
    .from(bannerPhaseCharacters)
    .innerJoin(bannerPhases, eq(bannerPhaseCharacters.phaseId, bannerPhases.id))
    .where(eq(bannerPhaseCharacters.characterId, charEntity.id))
    .orderBy(asc(bannerPhases.sequenceIndex));

  const stats = await db.query.bannerCharacterStatistics.findFirst({
    where: eq(bannerCharacterStatistics.characterId, charEntity.id),
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/banners/rerun-pressure" className="text-blue-400 hover:underline">
          &larr; Back to Rerun Pressure
        </Link>
      </div>

      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-white">{charEntity.name} Banner History</h1>
        <p className="text-gray-400">
          Chronological banner appearances, wait intervals, and statistical analysis.
        </p>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-orange-200 text-sm">
          <strong>Disclaimer:</strong> This is a statistical estimate based on historical banner rotations. It is not official information or a leak.
        </div>
      </header>

      {stats && (
        <section className="bg-[var(--surface-sunken)] border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-gray-500 text-sm uppercase">Historical Intervals</div>
              <div className="text-xl font-mono text-white mt-1">
                {stats.intervals && stats.intervals.length > 0 ? stats.intervals.slice(-5).join(", ") + (stats.intervals.length > 5 ? "..." : "") : "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm uppercase">Current Wait</div>
              <div className="text-xl font-mono text-white mt-1">{stats.currentWait} phases</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm uppercase">Typical Wait</div>
              <div className="text-xl font-mono text-white mt-1">
                {stats.medianInterval ?? "-"} <span className="text-gray-500 text-sm">median</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm uppercase">Pressure</div>
              <div className="text-xl font-mono text-white mt-1 capitalize">
                {stats.pressureLevel?.replace('_', ' ') ?? "-"}
              </div>
              <div className="text-gray-500 text-xs mt-1 capitalize">{stats.confidenceLevel} confidence</div>
            </div>
          </div>
          
          {stats.reasons && stats.reasons.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Analysis Reasons</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                {(stats.reasons as any[]).map((r, i) => (
                  <li key={i}>{r.message}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Appearance Timeline</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-[var(--surface-sunken)]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3">Sequence</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Phase Key</th>
                <th className="px-4 py-3">Dates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {appearances.map((app) => (
                <tr key={app.phaseKey} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-white">{app.sequenceIndex}</td>
                  <td className="px-4 py-3">{app.version} Phase {app.phaseNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{app.phaseKey}</td>
                  <td className="px-4 py-3">
                    {app.startDate?.toLocaleDateString()} - {app.endDate?.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {appearances.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No banner appearances found for this character.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
