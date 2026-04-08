/**
 * High-resolution Unsplash previews for the Kitchen asset library.
 * IDs are verified against images.unsplash.com (200). SVG fallbacks in assetThumbnails.ts if a load fails.
 *
 * @see https://unsplash.com/license
 */

const q = "auto=format&fit=crop&w=1600&q=88";

const u = (photoId: string) => `https://images.unsplash.com/photo-${photoId}?${q}`;

/** Macro / surface shots aligned with espresso kitchen, quartz, brass, tile */
export const MATERIAL_PHOTO_URLS: Record<string, string> = {
  "mat-oak-wood": u("1503602642458-232111445657"),
  "mat-pine-wood": u("1469474968028-56623f02e42e"),
  "mat-walnut-wood": u("1600566752355-35792bedcfea"),
  "mat-stainless-steel": u("1581092160562-40aa08e78837"),
  "mat-brushed-brass": u("1556911220-bff31c812dba"),
  "mat-cast-iron": u("1600607687939-ce8a6c25118c"),
  "mat-clear-glass": u("1558618666-fcd25c85cd64"),
  "mat-frosted-glass": u("1578662996442-48f60103fc96"),
  "mat-carrara-marble": u("1618220179428-22790b461013"),
  "mat-granite": u("1600210492486-724fe5c67fb0"),
  "mat-ceramic-tile": u("1556909114-f6e7ad7d3136"),
  "mat-porcelain": u("1563298723-dcfebaa392e3"),
};

/** Kitchen scene / product shots for props catalog */
export const PROP_PHOTO_URLS: Record<string, string> = {
  "prop-mason-jar": u("1578662996442-48f60103fc96"),
  "prop-wine-glasses": u("1510812431401-41d2bd2722f3"),
  "prop-oak-board": u("1618220179428-22790b461013"),
  "prop-base-cab-600": u("1556909114-f6e7ad7d3136"),
  "prop-wall-cab-800": u("1556909212-d5b604d0c90d"),
  "prop-oven-bi": u("1581092160562-40aa08e78837"),
  "prop-pantry-tall": u("1600566752355-35792bedcfea"),
  "prop-planter-ceramic": u("1469474968028-56623f02e42e"),
  "prop-counter-stool": u("1503602642458-232111445657"),
  "prop-pendant": u("1556911220-bff31c812dba"),
  "prop-blinds": u("1586023492125-27b2c045efd7"),
  "prop-kitchen-island": u("1600607687939-ce8a6c25118c"),
  "prop-gooseneck-kettle": u("1571175443880-49e1d25b2bc5"),
  "prop-mixing-bowl": u("1563298723-dcfebaa392e3"),
  "prop-mortar": u("1618220179428-22790b461013"),
};
