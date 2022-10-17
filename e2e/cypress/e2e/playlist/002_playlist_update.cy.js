import { playlist } from "../../fixtures/input"

describe("プレイリスト更新", () => {
  const now = Cypress.env("NOW")

  it("プレイリストを選択し、メタの更新をする", () => {
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    cy.get('[data-testid="api-status-select"]').select("全て")

    cy.get('[data-testid="playlist-list-items"]').contains(now).click()
    cy.get('[data-testid="playlist-drawer-edit-button"]').click()

    // リスト(NItemList)の編集 ------------------------------------------------
    cy.contains("リスト(NItemList)").click()

    // エピソードの選択
    // 2件目を削除
    cy.get('[data-testid="edit-episode-list"] [aria-label="削除"]')
      .last()
      .click()

    // 記事(NArticle)の編集 --------------------------------------------------
    cy.contains("記事(NArticle)").click()

    // 著者の変更
    cy.get('[data-testid="authorType-radio-group"]')
      .contains("個人(Person)")
      .click()
    cy.get('[data-testid="authorName"]').clear().type(`authorName`)

    // 発行者の変更
    cy.get('[data-testid="publisherType-radio-group"]')
      .contains("個人(Person)")
      .click()
    cy.get('[data-testid="publisherName"]').clear().type(`publisherName`)

    // 基本情報(NSeries)の編集 ------------------------------------------------
    cy.contains("基本情報(NSeries)").click()

    // プレイリスト名
    cy.get('[data-testid="name"]').clear().type(`${now}_プレイリスト2`)
    // キャッチコピー
    cy.get('[data-testid="detailedCatch"]')
      .clear()
      .type(`キャッチコピーはこちらに2`)
    // API State
    cy.get("label").contains("公開する").click() // 非公開に

    cy.contains("保存する").click({ force: true })
    cy.wait(5000)
    cy.contains("保存しました")
  })

  it("プレイリストの内容が正しいこと", () => {
    // 作成したプレイリストの確認
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    cy.get('[data-testid="api-status-select"]').select("全て")

    cy.wait(1000)

    cy.get('[data-testid="playlist-list-items"]').contains(now).click()

    // ドロワーの内容チェック
    const drawerSelector = '[data-testid="playlist-drawer-info"]'
    cy.get(drawerSelector).contains(`${now}_プレイリスト2`)
    cy.get(drawerSelector).contains("API非公開")
    cy.get(drawerSelector).contains("キャッチコピーはこちらに2")
    cy.get(`[data-testid="playlist-drawer-info__images"] img`).should(
      "have.lengthOf",
      3
    )
    cy.get('[data-testid="playlist-drawer-episode-list__item"]').should(
      "have.lengthOf",
      1
    )
    cy.get('[data-testid="playlist-drawer-edit-button"]').click()

    // プレイリスト編集画面の内容チェック
    // リスト(NItemList) タブ
    cy.contains("リスト(NItemList)").click()
    cy.get('[data-testid="edit-episode-list__item"]').should(
      "have.lengthOf",
      1
    )

    // 記事(NArticle) タブ
    cy.contains("記事(NArticle)").click()
    cy.get('[data-testid="markedHeader"]').should("have.value", playlist.markedHeader)
    cy.get(".ce-paragraph").contains("test")
    cy.get(".image-tool__image-picture").should("have.lengthOf", 1)
    cy.get('[data-testid="markedFooter"]').should("have.value", playlist.markedFooter)
    cy.get('[data-testid="authorName"]').should("have.value", "authorName")
    cy.get('[data-testid="publisherName"]').should(
      "have.value",
      "publisherName"
    )

    // 基本情報(NSeries) タブ
    cy.contains("基本情報(NSeries)").click()

    cy.get('[data-testid="name"]').should("have.value", `${now}_プレイリスト2`)
    cy.get('[data-testid="detailedNameRuby"]').should("have.value",playlist.detailedNameRuby)
    cy.get('[data-testid="detailedCatch"]').should(
      "have.value",
      "キャッチコピーはこちらに2"
    )
    cy.get('[data-testid="description"]').should("have.value", playlist.description)
    cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード1")
    cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード2")
    cy.get('[data-testid="hashtags-input-wrapper"]').contains("#ハッシュタグ1")
    cy.get('[data-testid="format-genre-wrapper"]').contains(playlist.formatGenre)
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
    cy.get('[data-testid="sameAsAttributes.0.name"]').should("have.value", playlist.sameAsName)
    cy.get('[data-testid="sameAsAttributes.0.url"]').should("have.value", playlist.sameAsUrl)
    // Citation
    cy.get('[data-testid="citationsAttributes.0.name"]').should("have.value", playlist.citationName)
    cy.get('[data-testid="citationsAttributes.0.url"]').should("have.value", playlist.citationUrl)
    // エイリアスID
    cy.get('[data-testid="aliasId"]').should("have.value", playlist.aliasId)
    // API State
    cy.get('[data-testid="apiState"] input[type="checkbox"]').should(
      "not.be.checked"
    )
    cy.get('[data-testid="activeItemList"] input[type="checkbox"]').should(
      "be.checked"
    )
    cy.get('[data-testid="activeArticle"] input[type="checkbox"]').should(
      "be.checked"
    )
  })
})
