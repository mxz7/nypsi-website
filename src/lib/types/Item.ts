export interface Item {
  id: string;
  name: string;
  emoji: string;
  shortDesc?: string;
  longDesc: string;
  buy?: number;
  sell?: number;
  role: string;
  default_count?: number;
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
  loot_pools?: {
    [pool: string]: number;
  }; // used for crates and scratches, indicates which pools to run and how many times
  clicks?: number; // amount of clicks for scratch cards
  tagId?: string;
  plantId: string; // for seeds
  unique: boolean; // only allow one in world at a time
}

export type LootPool = {
  nothing?: number; // weight
  money?: {
    [amount: number]: number; // amount: weight
  };
  xp?: {
    [amount: number]: number; // amount: weight
  };
  karma?: {
    [amount: number]: number; // amount: weight
  };
  items?: {
    [item: string]: LootPoolItemEntry;
  };
};

export type LootPoolItemEntry =
  | {
      weight?: number;
      count?:
        | {
            min: number;
            max: number;
          }
        | number;
    }
  | number; // item: weight, count assumed to be 1
