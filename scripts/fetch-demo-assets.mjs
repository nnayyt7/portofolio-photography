import { mkdir, writeFile } from 'node:fs/promises';

const sources = [
  ['photo-01', '1515886657613-9f3515b0c78f', 900, 1200],
  ['photo-02', '1480714378408-67cf0d13bc1b', 1200, 800],
  ['photo-03', '1470770841072-f978cf4d019e', 1100, 850],
  ['photo-04', '1534528741775-53994a69daeb', 850, 1100],
  ['photo-05', '1506157786151-b8491531f063', 1300, 850],
  ['photo-06', '1487958449943-2429e8be8625', 900, 1150],
  ['photo-07', '1500530855697-b586d89ba3ee', 1200, 800],
  ['photo-08', '1518837695005-2083093ee35b', 1000, 1000],
  ['photo-09', '1506794778202-cad84cf45f1d', 850, 1100],
  ['photo-10', '1472396961693-142e6e269027', 1000, 800],
  ['photo-11', '1470071459604-3b5ec3a7fe05', 1000, 1200],
  ['photo-12', '1519608487953-e999c86e7455', 1100, 800],
];
await mkdir('public/images/selected', { recursive: true });
await mkdir('public/images/archive', { recursive: true });
await mkdir('public/images/profile', { recursive: true });
await mkdir('docs', { recursive: true });
let failed = false;
for (let index = 0; index < sources.length; index += 3) {
  await Promise.all(sources.slice(index, index + 3).map(async ([name, id, w, h]) => {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82&fm=webp`;
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!response.ok) { failed = true; console.error(name, response.status); return; }
    await writeFile(`public/images/selected/${name}.webp`, Buffer.from(await response.arrayBuffer()));
    console.log(`Saved ${name}.webp`);
  }));
}
await writeFile('docs/asset-credits.md', '# Demo asset credits\n\nThese photographs are demonstration images, not work by the portfolio owner. Replace them before publishing your own portfolio.\n\nSource: [Unsplash](https://unsplash.com). [Unsplash License](https://unsplash.com/license), checked 27 September 2026. Images are stored locally; no runtime image API is used.\n\n' + sources.map(([name, id]) => `- ${name}.webp — https://images.unsplash.com/photo-${id}`).join('\n') + '\n\nFonts: Manrope (SIL Open Font License) and IBM Plex Mono (SIL Open Font License), bundled via @fontsource. License texts are copied into public/fonts.\n');
if (failed) process.exitCode = 1;
