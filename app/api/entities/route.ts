import { type NextRequest, NextResponse } from "next/server";
import { and, eq, ilike } from "drizzle-orm";
import { getDatabase } from "../../../db/client";
import { entities } from "../../../db/schema";
import { boundedLimit, DEMO_ENTITIES, resolveImageUrl } from "../utils";

export async function GET(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  const kind = request.nextUrl.searchParams.get("kind")?.toLowerCase() ?? null;
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = boundedLimit(request.nextUrl.searchParams.get("limit"));

  const headers = { "cache-control": "public, max-age=60, s-maxage=300" };

  if (!databaseUrl) {
    const filtered = DEMO_ENTITIES.filter(
      (entity) =>
        (!kind || entity.kind === kind) &&
        (!query || entity.name.toLowerCase().includes(query.toLowerCase())),
    ).slice(0, limit);
    return NextResponse.json({ items: filtered, preview: true, total: filtered.length }, { headers });
  }

  const database = getDatabase();
  const conditions = [eq(entities.isActive, true)];
  if (kind) conditions.push(eq(entities.kind, kind));
  if (query) conditions.push(ilike(entities.name, `%${query}%`));

  const rows = await database
    .select({
      id: entities.id,
      kind: entities.kind,
      slug: entities.slug,
      name: entities.name,
      description: entities.description,
      gameVersion: entities.gameVersion,
      customImageUrl: entities.customImageUrl,
      canonicalData: entities.canonicalData,
      updatedAt: entities.updatedAt,
    })
    .from(entities)
    .where(and(...conditions))
    .orderBy(entities.name)
    .limit(limit);

  return NextResponse.json(
    {
      items: rows.map(({ canonicalData, customImageUrl, ...entity }) => ({
        ...entity,
        image: resolveImageUrl(customImageUrl, canonicalData as any),
      })),
      preview: false,
      total: rows.length,
    },
    { headers }
  );
}
