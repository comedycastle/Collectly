// Bundles src/services/templateService.ts with esbuild (stubbing the Supabase
// client so no network/env is needed), then writes:
//   supabase/templates_seed.sql  - one INSERT per template
//   supabase/all_queries.sql     - schema.sql + templates_seed.sql
// Usage: node scripts/run-gen.cjs

const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(ROOT, 'node_modules', '.collectly-tplgen');
const BUNDLE = path.join(TMP, 'templates.cjs');

const SUPABASE_STUB = `
export const isSupabaseConfigured = false;
const chain = {
  select: () => chain,
  eq: () => chain,
  order: () => chain,
  limit: () => chain,
  insert: () => chain,
  maybeSingle: async () => ({ data: null, error: null }),
  single: async () => ({ data: null, error: null }),
  then: (resolve) => resolve({ data: [], error: null }),
};
export const supabase = { from: () => chain, auth: { getUser: async () => ({ data: { user: null } }) } };
`;

async function main() {
    fs.mkdirSync(TMP, { recursive: true });

    await esbuild.build({
        entryPoints: [path.join(ROOT, 'scripts', 'generate-templates-sql.ts')],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: 'node18',
        outfile: BUNDLE,
        logLevel: 'error',
        plugins: [
            {
                name: 'stub-supabase',
                setup(build) {
                    build.onResolve({ filter: /lib[\\/]supabaseClient$/ }, () => ({
                        path: 'supabaseClient',
                        namespace: 'stub',
                    }));
                    build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
                        contents: SUPABASE_STUB,
                        loader: 'ts',
                    }));
                },
            },
        ],
    });

    const { buildTemplatesSql, templateCount } = require(BUNDLE);
    const seedSql = buildTemplatesSql();

    const seedPath = path.join(ROOT, 'supabase', 'templates_seed.sql');
    fs.writeFileSync(seedPath, seedSql, 'utf8');

    const schemaPath = path.join(ROOT, 'supabase', 'schema.sql');
    const schemaSql = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';

    const allPath = path.join(ROOT, 'supabase', 'all_queries.sql');
    const banner = `-- ==========================================
-- COLLECTLY V2 - ALL SUPABASE SQL QUERIES (single file)
-- Part 1: supabase/schema.sql   (tables, indexes, RLS, policies, triggers, functions, storage)
-- Part 2: supabase/templates_seed.sql (${templateCount} templates with fields + logic rules)
-- Safe to re-run end to end.
-- ==========================================

`;
    fs.writeFileSync(allPath, `${banner}${schemaSql}\n\n${seedSql}`, 'utf8');

    fs.rmSync(TMP, { recursive: true, force: true });

    console.log(`templates: ${templateCount}`);
    console.log(`written:   supabase/templates_seed.sql (${seedSql.split('\n').length} lines)`);
    console.log(`written:   supabase/all_queries.sql`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});