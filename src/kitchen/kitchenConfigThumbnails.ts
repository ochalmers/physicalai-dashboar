import type { KitchenParamKey } from "@/kitchen/params";

/** Served from `public/assets/kitchen-config` (copied from `assets/Config assets`). */
export function kitchenConfigAssetUrl(filename: string): string {
  return `/assets/kitchen-config/${encodeURIComponent(filename)}`;
}

/**
 * Every option maps to a real file under Config assets so thumbnails always resolve.
 * Filenames match on-disk names (including trailing dots).
 */
const THUMBS: Partial<Record<KitchenParamKey, Record<string, string>>> = {
  Layout: {
    "L-Shaped": "l_shaped.svg.",
    "U-Shaped": "u_shaped.svg",
    Galley: "galley.svg.",
    "Single Wall": "single_wall.svg",
  },
  Island: {
    "No Island": "none.svg",
    "Standard Island": "standard.svg",
    "Large Island": "large.svg",
  },
  "Base Cabinet": {
    "Single Door": "single_door.svg",
    "Single Door + Drawer": "single_door_drawer.svg",
    "Single 2 Drawer": "single_2_drawer.svg",
    "Single 3 Drawer": "single_3_drawer.svg.",
    "Double Door": "double_door.svg",
    "Double Door + Drawer": "double_door_drawer.svg",
    "Double Door + 2 Drawer": "double_door_2_drawer.svg",
    "Oven Cabinet": "base_oven_cabinet.svg",
  },
  "Wall Cabinet": {
    "Single Door": "wall_single_door.svg",
    "Double Door": "wall_double_door.svg",
    "Microwave Cabinet": "microwave.svg",
  },
  "Tall Cabinet": {
    "Single Door": "tall_single_door.svg",
    "Double Door": "tall_double_door.svg",
    "Oven Cabinet": "tall_oven_cabinet.svg",
    "Refrigerator Cabinet": "refrigerator.svg.",
  },
  "Door Style": {
    Slab: "solid.svg",
    Shaker: "wood6_normal.jpg.",
    "Recessed Panel": "galaxy.svg",
    "Raised Panel": "onyx.svg.",
  },
  "Door Handle": {
    None: "none_1.svg",
    Knob: "knob.svg",
    "T Bar": "t_bar.svg",
    "D Pulls": "d_pulls.svg",
    "Handle 4": "handle_4.svg",
    "Handle 5": "handle_5.svg",
    "Handle 6": "handle_6.svg",
  },
  "Appliance Preset": {
    "Full Kitchen": "range_hood.svg",
    "Essential Only": "dishwasher.svg.",
    "All Appliances": "oven.svg",
    "Minimal (Sink Only)": "sink.svg",
  },
  "Cabinet Finish": {
    "Black Acrylic": "acrylic_color.svg",
    "White Metallic": "metallic_color.svg",
    Walnut: "wood2_basecolor.jpg.jpeg",
    "American Walnut": "wood3_basecolor.jpg.jpeg",
    Mahogany: "wood4_basecolor.jpg.jpeg",
    "White Oak": "wood1_basecolor.jpg.jpeg",
    "Sage Green": "fusion.svg",
    "Forest Green": "solid.svg",
    "Silk Grey": "wood7_normal.jpg.jpeg",
  },
  "Counter Top Finish": {
    "White Metallic": "normal.jpg.jpeg",
    Granite: "diffuse.jpg.jpeg",
    Stone: "roughness.jpg.jpeg",
    Terrazzo: "diffuse.jpg_1.jpeg",
    "Quartz Cloud": "roughness.jpg_2.jpeg",
    "Butcher Block": "wood2_roughness.jpg.jpeg",
  },
  "Hardware Finish": {
    Brass: "wood5_roughness.jpg.jpeg",
    Chrome: "wood4_normal.jpg.jpeg",
    "Matte Black": "wood6_roughness.jpg.jpeg",
    "Stainless Steel": "wood3_roughness.jpg.jpeg",
  },
  Lighting: {
    "Bright Daylight": "wood1_normal.jpg.",
    "Warm Evening": "microwave.svg",
    "Dim Artificial": "wood4_roughness.jpg.jpeg",
  },
  "Clutter Density": {
    Empty: "none.svg",
    Moderate: "roughness.jpg_1.jpeg",
    Dense: "wood7_roughness.jpg.jpeg",
  },
};

export function kitchenOptionThumbnail(key: KitchenParamKey, value: string): string {
  const name = THUMBS[key]?.[value];
  if (name) return kitchenConfigAssetUrl(name);
  return kitchenConfigAssetUrl("diffuse.jpg.jpeg");
}
