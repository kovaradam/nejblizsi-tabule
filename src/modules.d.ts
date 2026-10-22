// Bundled as raw text via the "Text" rule in wrangler.jsonc
declare module "*.client.js" {
  const source: string;
  export default source;
}

declare module "*.css" {
  const source: string;
  export default source;
}
