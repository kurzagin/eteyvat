import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
  varchar,
} from "drizzle-orm/pg-core";

export type SyncStatus = "running" | "failed" | "ready";

export const syncRuns = pgTable(
  "sync_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    status: text("status").$type<SyncStatus>().notNull().default("running"),
    source: text("source").notNull().default("genshin-db-api-v5"),
    sourceRevision: text("source_revision"),
    contentDigest: varchar("content_digest", { length: 64 }),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    entityCount: integer("entity_count").notNull().default(0),
    relationCount: integer("relation_count").notNull().default(0),
    unresolvedRelationCount: integer("unresolved_relation_count")
      .notNull()
      .default(0),
    summary: jsonb("summary").$type<Record<string, unknown>>().notNull().default({}),
    error: text("error"),
  },
  (table) => [
    index("sync_runs_status_started_idx").on(table.status, table.startedAt),
  ],
);

export const entities = pgTable(
  "entities",
  {
    id: serial("id").primaryKey(),
    sourceKey: text("source_key").notNull(),
    kind: text("kind").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    canonicalData: jsonb("canonical_data")
      .$type<Record<string, unknown>>()
      .notNull(),
    contentHash: varchar("content_hash", { length: 64 }).notNull(),
    gameVersion: text("game_version"),
    sourceUrl: text("source_url"),
    customImageUrl: text("custom_image_url"),
    isActive: boolean("is_active").notNull().default(true),
    lastSeenSyncId: uuid("last_seen_sync_id").references(() => syncRuns.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("entities_source_key_uidx").on(table.sourceKey),
    uniqueIndex("entities_kind_slug_uidx").on(table.kind, table.slug),
    index("entities_kind_active_name_idx").on(
      table.kind,
      table.isActive,
      table.name,
    ),
  ],
);

export const aliases = pgTable(
  "aliases",
  {
    id: serial("id").primaryKey(),
    entityId: integer("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("English"),
    alias: text("alias").notNull(),
    normalizedAlias: text("normalized_alias").notNull(),
  },
  (table) => [
    uniqueIndex("aliases_entity_language_alias_uidx").on(
      table.entityId,
      table.language,
      table.normalizedAlias,
    ),
    index("aliases_normalized_idx").on(table.normalizedAlias),
  ],
);

export const relations = pgTable(
  "relations",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    predicate: text("predicate").notNull(),
    objectId: integer("object_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    sourcePath: text("source_path").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    lastSeenSyncId: uuid("last_seen_sync_id").references(() => syncRuns.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("relations_identity_uidx").on(
      table.subjectId,
      table.predicate,
      table.objectId,
      table.sourcePath,
    ),
    index("relations_subject_predicate_idx").on(
      table.subjectId,
      table.predicate,
    ),
    index("relations_object_predicate_idx").on(
      table.objectId,
      table.predicate,
    ),
  ],
);

export const knowledgeDocuments = pgTable(
  "knowledge_documents",
  {
    id: serial("id").primaryKey(),
    entityId: integer("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    section: text("section").notNull(),
    content: text("content").notNull(),
    contentHash: varchar("content_hash", { length: 64 }).notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("knowledge_documents_entity_section_uidx").on(
      table.entityId,
      table.section,
    ),
    index("knowledge_documents_entity_idx").on(table.entityId),
    index("knowledge_documents_fts_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.content})`,
    ),
  ],
);

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;
export type Relation = typeof relations.$inferSelect;

