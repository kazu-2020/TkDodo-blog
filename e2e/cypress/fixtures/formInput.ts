import { faker } from "@faker-js/faker";
faker.locale = "ja";

const now = Cypress.env("NOW");

export type Citation = Record<"name" | "url", string>;
export type SameAs = Record<"name" | "url", string>;

export type PlaylistInput = {
  name: string;
  detailedNameRuby?: string;
  detailedCatch?: string;
  description?: string;
  keywords?: string;
  hashTags?: string;
  formatGenre?: string;
  themeGenre?: string;
  sameAs?: SameAs[];
  citation?: Citation[];
  aliasId?: string;
  apiState?: boolean;
  activeItemList?: boolean;
  activeTvepisode?: boolean;
  activeFaqpage?: boolean;
  activeHowto?: boolean;
  activeEvent?: boolean;
  activeRecipe?: boolean;
  activeArticle?: boolean;
  markedHeader?: string;
  markedFooter?: string;
  authorName?: string;
  publisherName?: string;
  beforeSave?: Function;
};

export const playlistInput = (overrides = {}): PlaylistInput => {
  return {
    name: `${faker.word.adjective()}_プレイリスト`,
    ...overrides,
  };
};

export type RecommendDeckInput = {
  name: string;
  interfix: string;
  description?: string;
  apiState?: boolean;
  sameAs?: SameAs[];
  beforeSave?: Function;
};

export const recommendDeckInput = (overrides = {}): RecommendDeckInput => {
  return {
    name: `${faker.word.adjective()}_レコメンドデッキ`,
    interfix: faker.datatype.uuid(),
    ...overrides,
  };
};

export type SeriesDeckInput = {
  name: string;
  interfix: string;
  description?: string;
  apiState?: boolean;
  beforeSave?: Function;
};

export const seriesDeckInput = (overrides = {}): SeriesDeckInput => {
  return {
    name: `${faker.word.adjective()}_シリーズデッキ`,
    interfix: faker.datatype.uuid(),
    ...overrides,
  };
};
