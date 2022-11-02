import { faker } from "@faker-js/faker";
faker.locale = "ja";

const now = Cypress.env("NOW");
export const playlist = {
  name: `${now}_プレイリスト`,
  detailedNameRuby: "ぷれいりすと１",
  detailedCatch: "キャッチコピーはこちらに",
  description: "説明",
  keywords: "キーワード1{enter}キーワード2{enter}",
  hashTags: "#ハッシュタグ1{enter}",
  formatGenre: "報道",
  themeGenre: "科学",
  sameAsName: "same-as1",
  sameAsUrl: "https://example.com/same-as",
  citationName: "citation1",
  citationUrl: "https://example.com/citation",
  aliasId: `alias-${new Date(now).getTime()}`,
  markedHeader: "ヘッダー",
  markedFooter: "フッター",
};

type sameAs = {
  name: string;
  url: string;
};

export type RecommendDeckInput = {
  name: string;
  interfix: string;
  description?: string;
  apiState?: boolean;
  sameAs?: sameAs[];
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
};

export const seriesDeckInput = (overrides = {}): SeriesDeckInput => {
  return {
    name: `${faker.word.adjective()}_シリーズデッキ`,
    interfix: faker.datatype.uuid(),
    ...overrides,
  };
};
