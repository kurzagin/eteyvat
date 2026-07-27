import { getDatabase } from "@/db/client";
import { bannerCharacterStatistics, entities, bannerPhases } from "@/db/schema";
import { eq, desc, isNotNull } from "drizzle-orm";
import Link from "next/link";

export const metadata = {
  title: "Rerun Pressure Analysis",
  description: "Statistical estimates for upcoming Genshin Impact character banners based on historical data.",
};

export default async function RerunPressurePage() {
  const db = getDatabase();

  const currentPhase = await db.query.bannerPhases.findFirst({
    where: eq(bannerPhases.status, "active"),
    orderBy: (phases, { desc }) => [desc(phases.sequenceIndex)],
  }) || await db.query.bannerPhases.findFirst({
    where: eq(bannerPhases.status, "completed"),
    orderBy: (phases, { desc }) => [desc(phases.sequenceIndex)],
  });

  const characters = await db
    .select({
      slug: entities.slug,
      name: entities.name,
      currentWait: bannerCharacterStatistics.currentWait,
      medianInterval: bannerCharacterStatistics.medianInterval,
      pressureScore: bannerCharacterStatistics.pressureScore,
      pressureLevel: bannerCharacterStatistics.pressureLevel,
      confidenceLevel: bannerCharacterStatistics.confidenceLevel,
    })
    .from(bannerCharacterStatistics)
    .innerJoin(entities, eq(bannerCharacterStatistics.characterId, entities.id))
    .where(isNotNull(bannerCharacterStatistics.pressureScore))
    .orderBy(desc(bannerCharacterStatistics.pressureScore));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-white">4-Star Rerun Pressure</h1>
        <p className="text-gray-400">
          Rankings of characters most historically "due" for a rerun. 
          {currentPhase && ` Currently calculated against Phase Index ${currentPhase.sequenceIndex} (${currentPhase.phaseKey}).`}
        </p>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-orange-200 text-sm">
          <strong>Disclaimer:</strong> This is a statistical estimate based on historical banner rotations. It is not official information or a leak. HoYoverse may intentionally break past rotation patterns. A high score means historically due, not officially scheduled.
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-white/10 bg-[var(--surface-sunken)]">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3">Character</th>
              <th className="px-4 py-3">Current Wait</th>
              <th className="px-4 py-3">Typical Wait (Median)</th>
              <th className="px-4 py-3">Pressure Score</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {characters.map((char) => (
              <tr key={char.slug} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">
                  <Link href={`/characters/${char.slug}/banner-history`} className="hover:text-blue-400">
                    {char.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{char.currentWait} phases</td>
                <td className="px-4 py-3">{char.medianInterval ?? "-"} phases</td>
                <td className="px-4 py-3 font-mono">{char.pressureScore}</td>
                <td className="px-4 py-3 capitalize">{char.pressureLevel?.replace('_', ' ')}</td>
                <td className="px-4 py-3 capitalize">{char.confidenceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
