import { getDatabase } from "@/db/client";
import { bannerPhases, bannerPhaseCharacters, entities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Banner Rotation Timeline",
  description: "Chronological timeline of Genshin Impact banner phases and featured characters.",
};

export default async function BannerRotationPage() {
  const db = getDatabase();

  const phases = await db
    .select()
    .from(bannerPhases)
    .orderBy(desc(bannerPhases.sequenceIndex))
    .limit(20);

  const phaseIds = phases.map(p => p.id);
  
  let charactersByPhase = new Map<number, any[]>();
  if (phaseIds.length > 0) {


      const allChars = await db
        .select({
          phaseId: bannerPhaseCharacters.phaseId,
          slug: entities.slug,
          name: entities.name,
          rarity: bannerPhaseCharacters.rarity,
        })
        .from(bannerPhaseCharacters)
        .innerJoin(entities, eq(bannerPhaseCharacters.characterId, entities.id));

      for (const row of allChars) {
        if (!charactersByPhase.has(row.phaseId)) {
          charactersByPhase.set(row.phaseId, []);
        }
        charactersByPhase.get(row.phaseId)!.push({
          slug: row.slug,
          name: row.name,
          rarity: row.rarity,
        });
      }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Banner Rotation Timeline</h1>
        <p className="text-gray-400">
          Chronological history of event wish banners. (Showing last 20 phases)
        </p>
      </header>

      <div className="space-y-6">
        {phases.map((phase) => {
          const featured = charactersByPhase.get(phase.id) || [];
          const fiveStars = featured.filter(c => c.rarity === 5);
          const fourStars = featured.filter(c => c.rarity === 4);

          return (
            <div key={phase.id} className="bg-[var(--surface-sunken)] border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Version {phase.version} Phase {phase.phaseNumber}
                  </h2>
                  <div className="text-gray-500 text-sm mt-1">
                    {phase.startDate?.toLocaleDateString()} - {phase.endDate?.toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                  phase.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                  phase.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 
                  'bg-white/10 text-gray-400'
                }`}>
                  {phase.status}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#facc15] mb-2 uppercase">5-Star Features</h3>
                  <div className="flex flex-wrap gap-4">
                    {fiveStars.map(char => (
                      <Link key={char.slug} href={`/characters/${char.slug}/banner-history`} className="block">
                        <div className="bg-black/40 border border-white/5 rounded px-4 py-2 hover:border-[#facc15]/50 transition-colors">
                          <span className="text-white font-medium">{char.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#c084fc] mb-2 uppercase">4-Star Features</h3>
                  <div className="flex flex-wrap gap-3">
                    {fourStars.map(char => (
                      <Link key={char.slug} href={`/characters/${char.slug}/banner-history`} className="text-gray-300 hover:text-[#c084fc] hover:underline transition-colors">
                        {char.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
