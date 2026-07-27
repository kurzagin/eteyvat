import { getDatabase } from "@/db/client";
import { bannerPhases, bannerPhaseCharacters, entities, bannerCharacterStatistics } from "@/db/schema";
import { eq, desc, isNotNull, or } from "drizzle-orm";
import Link from "next/link";
import { WaitDistributionChart } from "./client-charts";

export const metadata = {
  title: "Banners Overview",
  description: "Current Genshin Impact banners and rerun statistics.",
};

export default async function BannersPage() {
  const db = getDatabase();

  const currentPhase = await db.query.bannerPhases.findFirst({
    where: or(eq(bannerPhases.status, "active"), eq(bannerPhases.status, "upcoming")),
    orderBy: (phases, { desc }) => [desc(phases.sequenceIndex)],
  });

  let featuredChars: any[] = [];
  if (currentPhase) {
    featuredChars = await db
      .select({
        slug: entities.slug,
        name: entities.name,
        rarity: bannerPhaseCharacters.rarity,

      })
      .from(bannerPhaseCharacters)
      .innerJoin(entities, eq(bannerPhaseCharacters.characterId, entities.id))
      .where(eq(bannerPhaseCharacters.phaseId, currentPhase.id));
  }

  // Get data for Wait Distribution Chart (4-stars)
  const stats = await db
    .select({
      currentWait: bannerCharacterStatistics.currentWait,
    })
    .from(bannerCharacterStatistics)
    .innerJoin(entities, eq(bannerCharacterStatistics.characterId, entities.id))
    .where(isNotNull(bannerCharacterStatistics.pressureScore));

  const waitCounts = new Map<number, number>();
  stats.forEach(s => {
    const wait = s.currentWait;
    waitCounts.set(wait, (waitCounts.get(wait) || 0) + 1);
  });
  const distributionData = Array.from(waitCounts.entries())
    .map(([wait, count]) => ({ wait, count }))
    .sort((a, b) => a.wait - b.wait);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Event Wish Banners</h1>
        <p className="text-gray-400">
          Overview of current banners, rotation history, and statistical rerun estimates.
        </p>
      </header>

      {/* Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/banners/rotation" className="group block">
          <div className="bg-[var(--surface-sunken)] border border-white/10 hover:border-blue-500/50 rounded-xl p-6 transition-all h-full">
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">Rotation Timeline &rarr;</h2>
            <p className="text-gray-400 mt-2">View the complete chronological history of character banner phases.</p>
          </div>
        </Link>
        <Link href="/banners/rerun-pressure" className="group block">
          <div className="bg-[var(--surface-sunken)] border border-white/10 hover:border-orange-500/50 rounded-xl p-6 transition-all h-full">
            <h2 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">Rerun Pressure &rarr;</h2>
            <p className="text-gray-400 mt-2">See which characters are statistically most "due" for a rerun based on their historical patterns.</p>
          </div>
        </Link>
      </section>

      {/* Current Banner Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-bold text-white">Current Banners</h2>
          {currentPhase && (
            <div className="text-gray-400 text-sm">
              Version {currentPhase.version} Phase {currentPhase.phaseNumber} ({currentPhase.status})
            </div>
          )}
        </div>
        
        {currentPhase ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/20 border border-white/5 rounded-xl p-6">
              <h3 className="text-[#facc15] font-semibold uppercase tracking-wider mb-4">Character Event Wishes</h3>
              <div className="grid grid-cols-2 gap-4">
                {featuredChars.filter(c => c.rarity === 5).map(char => (
                  <Link href={`/characters/${char.slug}`} key={char.slug}>
                    <div className="aspect-[3/4] relative rounded-lg border border-[#facc15]/30 bg-gradient-to-t from-[#facc15]/20 to-transparent flex items-end p-4 hover:from-[#facc15]/40 transition-colors">
                      <span className="text-white font-bold drop-shadow-md relative z-10">{char.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-[#c084fc] font-semibold text-sm uppercase tracking-wider mb-3">Featured 4-Stars</h4>
                <div className="flex flex-wrap gap-3">
                  {featuredChars.filter(c => c.rarity === 4).map(char => (
                    <Link key={char.slug} href={`/characters/${char.slug}`} className="bg-[#c084fc]/10 text-gray-200 border border-[#c084fc]/20 rounded-full px-4 py-1.5 text-sm hover:bg-[#c084fc]/20 transition-colors">
                      {char.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-[#facc15] font-semibold uppercase tracking-wider mb-4">Epitome Invocation (Weapons)</h3>
              <div className="text-gray-500 p-8 border border-dashed border-gray-600 rounded-lg">
                <p>Weapon banner tracking is currently not available in the dataset.</p>
                <p className="text-sm mt-2">Signature weapons usually run alongside their respective 5-star characters.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 p-8 border border-white/10 rounded-xl bg-[var(--surface-sunken)]">
            No active banners found in the database.
          </div>
        )}
      </section>

      {/* Statistics Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">4-Star Rerun Wait Distribution</h2>
        <div className="bg-[var(--surface-sunken)] border border-white/10 rounded-xl p-6 h-[400px]">
          <WaitDistributionChart data={distributionData} />
        </div>
      </section>

    </div>
  );
}
