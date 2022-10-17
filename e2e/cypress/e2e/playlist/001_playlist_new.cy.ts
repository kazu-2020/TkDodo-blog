import { playlist } from "../../fixtures/input"

before(() => {
  // FIXME: 効いてない？
  // APIモックを定義
  const apiUrl = Cypress.env("API_URL")
  cy.fixture("episodes/search.json").then((episodesSearchFixture) => {
    cy.intercept(
      "GET",
      `${apiUrl}/episodes/search?word=&offset=0&order_by=score&order=desc&ignore_range=false&size=10`,
      episodesSearchFixture
    )
  })

  cy.intercept(
    "GET",
    `${apiUrl}/episodes/bundle_items?episode_ids=123JXPM5ZQ`,
    { tvepisode: 1, event: 0, howto: 0, faqpage: 0 }
  )
  cy.intercept(
    "GET",
    `${apiUrl}/episodes/bundle_items?episode_ids=123JXPM5ZQ%2CQZ1M9NX81N`,
    { tvepisode: 2, event: 0, howto: 0, faqpage: 0 }
  )
})

describe("プレイリスト新規作成", () => {
  const now = Cypress.env("NOW")

  it("プレイリストを新規作成し、メタの編集をする", () => {
    cy.visit("/")

    cy.contains("プレイリスト").click()
    cy.contains("新規作成").click()

    // リスト(NItemList)の編集 ------------------------------------------------
    cy.contains("リスト(NItemList)").click()

    // エピソードの選択
    cy.get('[data-testid="search-text-input"]').clear().type("{enter}")
    // 検索結果の1件目を追加
    cy.get('[aria-label="追加"]').first().click()
    // 検索結果の2件目を追加
    // 1件目追加の時点で、1件目はリストから除外されるため先頭が2件目となる
    cy.get('[aria-label="追加"]').first().click()

    // 記事(NArticle)の編集 --------------------------------------------------
    cy.contains("記事(NArticle)").click()
    cy.get('[data-testid="markedHeader"]').type(playlist.markedHeader)

    // paragraph
    cy.get("#editorjs").get("div.ce-block")
      .click().type("test{enter}")
    // 画像をペースト
    cy.get('.ce-paragraph').last().paste({
      'text/plain': 'https://picsum.photos/200.jpg',
    })
    cy.get('.image-tool__image-picture').should("have.lengthOf", 1)

    cy.get('[data-testid="markedFooter"]').type(playlist.markedFooter)

    // 基本情報(NSeries)の編集 ------------------------------------------------
    cy.contains("基本情報(NSeries)").click()
    // プレイリスト名
    cy.get('[data-testid="name"]').type(playlist.name)
    // ふりがな
    cy.get('[data-testid="detailedNameRuby"]')
      .clear()
      .type(playlist.detailedNameRuby)
    // キャッチコピー
    cy.get('[data-testid="detailedCatch"]').clear().type(playlist.detailedCatch)
    // 説明
    cy.get('[data-testid="description"]').clear().type(playlist.description)
    // キーワード
    cy.get('[data-testid="keywords-input-wrapper"] input[type=text]').type(
      playlist.keywords,
      { force: true }
    )
    // ハッシュタグ
    cy.get('[data-testid="hashtags-input-wrapper"] input[type="text"]').type(
      playlist.hashTags,
      { force: true }
    )
    // フォーマットジャンル
    cy.get('[data-testid="format-genre-wrapper"]').click()
    cy.contains(playlist.formatGenre).click({ force: true })
    // テーマジャンル
    cy.get('[data-testid="theme-genre-wrapper"]').click()
    cy.contains(playlist.themeGenre).click({ force: true })
    // 画像
    cy.attachCoverPhoto("logo")
    cy.attachCoverPhoto("eyecatch")
    cy.attachCoverPhoto("hero")
    // 色
    cy.get('[data-testid="color-picker-card"]').click()
    cy.get('[data-testid="hex-color-input"]').clear().type("#FFFFFF{enter}")
    // SameAs
    cy.get('[data-testid="add-same-as-button"]').click()
    cy.get('[data-testid="sameAsAttributes.0.name"]').clear().type(playlist.sameAsName)
    cy.get('[data-testid="sameAsAttributes.0.url"]').clear().type(playlist.sameAsUrl)
    // Citation
    cy.get('[data-testid="add-citation-button"]').click()
    cy.get('[data-testid="citationsAttributes.0.name"]')
      .clear()
      .type(playlist.citationName)
    cy.get('[data-testid="citationsAttributes.0.url"]')
      .clear()
      .type(playlist.citationUrl)
    // エイリアス
    cy.get('[data-testid="aliasId"]').type(playlist.aliasId)
    // API State
    cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
      force: true,
    })
    // Active ON/OFF
    cy.get('[data-testid="activeItemList"] input[type="checkbox"]').check({
      force: true,
    })
    cy.get('[data-testid="activeArticle"] input[type="checkbox"]').check({
      force: true,
    })

    cy.contains("保存する").click({ force: true })
    cy.wait(5000)
    cy.contains("作成しました")
  })

  it("作成したプレイリストの内容が正しいこと", () => {
    // 作成したプレイリストの確認
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    cy.get('[data-testid="api-status-select"]').select("全て")

    cy.get('[data-testid="playlist-list-items"]').contains(now).click()

    // ドロワーの内容チェック
    const drawerSelector = '[data-testid="playlist-drawer-info"]'
    cy.get(drawerSelector).contains(`${now}_プレイリスト`)
    cy.get(drawerSelector).contains("API公開中")
    cy.get(drawerSelector).contains("summary")
    cy.get(drawerSelector).contains("キャッチコピーはこちらに")
    cy.get(drawerSelector).contains("説明")
    cy.get(`[data-testid="playlist-drawer-info__images"] img`).should(
      "have.lengthOf",
      3
    )
    cy.get('[data-testid="playlist-drawer-episode-list__item"]').should(
      "have.lengthOf",
      2
    )
    cy.get('[data-testid="playlist-drawer-edit-button"]').click()

    // プレイリスト編集画面の内容チェック
    // リスト(NItemList) タブ
    cy.contains("リスト(NItemList)").click()
    cy.get('[data-testid="edit-episode-list__item"]').should(
      "have.lengthOf",
      2
    )

    // 記事(NArticle) タブ
    cy.contains("記事(NArticle)").click()
    cy.get('[data-testid="markedHeader"]').should('have.value', playlist.markedHeader)

    cy.get(".ce-paragraph").contains('test')
    cy.get('.image-tool__image-picture').should("have.lengthOf", 1)
    cy.get('[data-testid="markedFooter"]').should('have.value', playlist.markedFooter)

    // 基本情報(NSeries) タブ
    cy.contains("基本情報(NSeries)").click()

    cy.get('[data-testid="name"]').should("have.value", playlist.name)
    cy.get('[data-testid="detailedNameRuby"]').should(
      "have.value",
      playlist.detailedNameRuby
    )
    cy.get('[data-testid="detailedCatch"]').should(
      "have.value",
      playlist.detailedCatch
    )
    cy.get('[data-testid="description"]').should(
      "have.value",
      playlist.description
    )
    cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード1")
    cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード2")

    cy.get('[data-testid="hashtags-input-wrapper"]').contains("#ハッシュタグ1")

    cy.get('[data-testid="format-genre-wrapper"]').contains(
      playlist.formatGenre
    )
    cy.get('[data-testid="theme-genre-wrapper"]').contains(playlist.themeGenre)

    // 画像
    cy.get(`[data-testid="logo-image-wrapper"] img`).should(
      "not.have.attr",
      "src",
      "dummy"
    )
    cy.get(`[data-testid="eyecatch-image-wrapper"] img`).should(
      "not.have.attr",
      "src",
      "dummy"
    )
    cy.get(`[data-testid="hero-image-wrapper"] img`).should(
      "not.have.attr",
      "src",
      "dummy"
    )

    // color
    cy.get('[data-testid="adjusted-color-text-primaryLight"]').contains(
      "#929292"
    )
    cy.get('[data-testid="adjusted-color-text-primaryDark"]').contains(
      "#ffffff"
    )
    cy.get('[data-testid="adjusted-color-text-linkLight"]').contains("#747474")
    cy.get('[data-testid="adjusted-color-text-linkDark"]').contains("#ffffff")

    // SameAs
    cy.get('[data-testid="sameAsAttributes.0.name"]').should(
      "have.value",
      playlist.sameAsName
    )
    cy.get('[data-testid="sameAsAttributes.0.url"]').should(
      "have.value",
      playlist.sameAsUrl
    )

    // Citation
    cy.get('[data-testid="citationsAttributes.0.name"]').should(
      "have.value",
      playlist.citationName
    )
    cy.get('[data-testid="citationsAttributes.0.url"]').should(
      "have.value",
      playlist.citationUrl
    )

    // エイリアスID
    cy.get('[data-testid="aliasId"]').should("have.value", playlist.aliasId)

    // API State
    cy.get('[data-testid="apiState"] input[type="checkbox"]').should(
      "be.checked"
    )

    cy.get('[data-testid="activeItemList"] input[type="checkbox"]').should(
      "be.checked"
    )
    cy.get('[data-testid="activeArticle"] input[type="checkbox"]').should(
      "be.checked"
    )
  })

  it("新規作成したプレイリストが検索できること", () => {
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    // API非公開
    cy.get('[data-testid="api-status-select"]').select("API非公開のみ", {
      force: true,
    })

    // 対象のプレイリストが表示されていないこと
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 0)

    // 検索
    cy.get('[data-testid="search-text-input"]').type(`${now}{enter}`, {
      force: true,
    })

    // 対象のプレイリストが表示されていないこと
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 0)

    // 対象のプレイリストが表示されていないこと
    cy.get("body").then((body) => {
      if (body[0].querySelector(".playlist-name")) {
        cy.get(".playlist-name").contains(now).should("have.lengthOf", 0)
      }
    })

    // API公開中
    cy.get('[data-testid="api-status-select"]').select("API公開中のみ", {
      force: true,
    })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 1)

    // 検索
    cy.get('[data-testid="search-text-input"]').clear().type(`${now}{enter}`, {
      force: true,
    })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 1)

    // 全て
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 1)

    // 検索
    cy.get('[data-testid="search-text-input"]').clear().type(`${now}{enter}`, {
      force: true,
    })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-items"]')
      .contains(now)
      .should("have.lengthOf", 1)
  })
})
