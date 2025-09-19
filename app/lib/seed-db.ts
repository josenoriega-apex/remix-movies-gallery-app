import fs from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seedsPath = path.join(__dirname, '../../drizzle-seed');
const seeds = fs
  .readdirSync(seedsPath)
  .map((seedPath) => fs.readFileSync(path.join(seedsPath, seedPath), { encoding: 'utf-8' }))
  .map(x => JSON.parse(x))

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const queries = seeds.map((seed: { table: string, data: Record<string, number | string>[]}) => {
  const columns = Object.keys(seed.data[0]).map(x => `"${x}"`);
  const values = seed.data.map(record => {
    return `(${Object.values(record).map(x => typeof x === 'string' ? `'${x.replaceAll('’', `'`).replaceAll(`'`, `''`)}'` : x).join(',')})`
  }).join(',');

  return sql.raw(`INSERT INTO ${seed.table} (${columns.join(',')}) OVERRIDING SYSTEM VALUE VALUES ${values}`);
});

await Promise.all(queries.map(query => db.execute(query)));
await client.end();

console.log('Database seeded!');
