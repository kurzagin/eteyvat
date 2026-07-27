# E-Teyvat

E-Teyvat is a structured Genshin Impact knowledge graph for pages, public read APIs, and AI retrieval. It uses a static Next.js frontend, a lightweight Cloudflare worker API, Neon Postgres, and Drizzle ORM.

## Documentation

- [Architecture and AI retrieval](docs/architecture.md)
- [Read API reference](docs/api.md)

## Getting started

Install dependencies and start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000). The static pages show an explicit preview state until the hosted worker has a `DATABASE_URL`. Copy `.env.example` to `.env.local` for database tooling.

## Neon setup

1. Create a Neon project and copy its pooled connection string.
2. Set `DATABASE_URL` locally and as a GitHub Actions repository secret.
3. Apply the schema with `bun run db:migrate`.
4. Run the first import with `bun run sync:genshin`.
5. Add `DATABASE_URL` as a hosted runtime value for the Sites worker.

The scheduled workflow runs on the first day of every month and can also be started manually after a Genshin release.

## Data model

- `entities`: canonical English records from the genshin-db v5 API
- `aliases`: normalized names for entity resolution
- `relations`: typed graph edges such as `requires`, `rewards`, and `located_in`
- `knowledge_documents`: full-text and optional 768-dimensional vector retrieval
- `sync_runs`: revision, coverage, and failed-import history

The importer hashes every record, preserves embeddings for unchanged documents, and regenerates graph relationships after a validated download.

Vector storage is prepared but embeddings are not generated yet. Full-text retrieval and graph traversal work without an embedding provider.

## Read API

- `GET /api/health`
- `GET /api/entities?kind=weapons&q=splendor`
- `GET /api/entities/:kind/:slug`
- `GET /api/farming?target=Splendor%20of%20Tranquil%20Waters`
- `GET /api/knowledge/search?q=off-field%20hydro`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Data and assets copyright (c) COGNOSPHERE PTE. LTD. (HoYoverse). All rights reserved.
