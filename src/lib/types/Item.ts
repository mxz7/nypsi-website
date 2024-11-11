export type Item = {
  id: string;
  name: string;
  emoji: string;
  shortDesc?: string;
  longDesc: string;
  buy?: number;
  sell?: number;
  role: string;
  booster_desc?: string;
  aliases?: string[];
  speed?: number;
  rarity?: number;
  boobies?: string;
  ingot?: string;
  stackable?: boolean;
  max?: number;
  boosterEffect?: {
    boosts: string[];
    effect: number;
    time: number;
  };
  worker_upgrade_id?: string;
  plural?: string;
  article: string;
  craft?: {
    ingredients: string[]; // format: item_id:amount
    time: number; // seconds
  };
  in_crates: boolean;
  account_locked?: boolean;
  items?: string[]; // used for crates with specific items format: <id|role>:(value)
  crate_runs?: number; // how many times to do crate thing
  clicks?: number; // amount of clicks for scratch cards
  random_drop_chance?: number; // chance to appear in random drop pool
  tagId?: string;
  // upgrades?: CarUpgradeType;
  plantId: string; // for seeds
};
