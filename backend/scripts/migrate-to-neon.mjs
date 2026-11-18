// Copies site content into Neon Postgres.
// Source: Vercel KV (live data) if KV credentials are set, otherwise data/db.json.
// Usage: node scripts/migrate-to-neon.mjs [--from-file]
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_PATH = path.join(__dirname, '../data/db.json');
const KEY = 'gprsi_site_content';
const fromFile = process.argv.includes('--from-file');

async function loadSource() {
    if (!fromFile && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import('@vercel/kv');
        const data = await kv.get(KEY);
        if (data) return { data, source: 'Vercel KV' };
        console.warn('Vercel KV key is empty, falling back to db.json');
    }
    return { data: JSON.parse(fs.readFileSync(DB_PATH, 'utf8')), source: 'data/db.json' };
}

async function migrate() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing from backend/.env');
        process.exit(1);
    }
    const sql = neon(process.env.DATABASE_URL);

    await sql`
        CREATE TABLE IF NOT EXISTS site_content (
            key        text PRIMARY KEY,
            data       jsonb NOT NULL,
            updated_at timestamptz NOT NULL DEFAULT now()
        )`;

    const { data, source } = await loadSource();
    console.log(`Read content from ${source}: ${data.projects?.length ?? 0} projects, ${data.services?.length ?? 0} services`);

    // Back up the source so nothing is lost if the copy needs redoing.
    const backup = path.join(__dirname, `../data/backup-${Date.now()}.json`);
    fs.writeFileSync(backup, JSON.stringify(data, null, 4));
    console.log(`Backup written to ${backup}`);

    await sql`
        INSERT INTO site_content (key, data, updated_at)
        VALUES (${KEY}, ${JSON.stringify(data)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;

    const [row] = await sql`SELECT jsonb_array_length(data->'projects') AS projects, jsonb_array_length(data->'services') AS services FROM site_content WHERE key = ${KEY}`;
    console.log(`Done. Neon now holds ${row.projects} projects and ${row.services} services.`);
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
