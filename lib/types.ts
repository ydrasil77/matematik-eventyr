export type HeroClass = "kriger" | "magiker" | "ranger" | "laerd";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  heroClass: HeroClass;
  mountId: string;
  titleId: string;
  achievementIds: string[];
  mathXP: number;
  mathDungeonFloor: number;
  createdAt: string;
}
