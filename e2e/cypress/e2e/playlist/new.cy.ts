import { playlistInput } from "../../fixtures/formInput"

describe("プレイリスト新規作成", () => {
  before(() => {
    cy.deleteAllPlaylists()
  })

  context("全項目を入力した場合", () => {
    const inputData = playlistInput({
      name: "テストプレイリスト",
      detailedCatch: "キャッチコピーはこちら",
      detailedNameRuby: "てすとぷれいりすと",
      description: "説明",
      keywords: "キーワード1{enter}キーワード2{enter}",
      hashTags: "#ハッシュタグ1{enter}",
      formatGenre: "報道",
      themeGenre: "科学",
      sameAs: [{ name: "same-as", url: "https://example.com" }],
      citation: [{ name: "citation", url: "https://example.com" }],
      aliasId: "alias-123456789",
      markedHeader: "ヘッダー",
      markedFooter: "フッター",
      authorName: "著者",
      publisherName: "出版社",
      activeArticle: true,
      beforeSave: () => {
        cy.contains("記事(NArticle)").click()
        // paragraph
        cy.get("#editorjs").get("div.ce-block").click().type("test{enter}")
        // 画像をペースト
        cy.get(".ce-paragraph").last().paste({
          "text/plain": "https://picsum.photos/200.jpg",
        })
        cy.get(".image-tool__image-picture")
          .should("have.attr", "src")
          .should("include", "article_images")

        cy.wait(500) // 記事画像を貼り付けてすぐ保存ボタンを押すと保存されない場合があるため
      },
    })

    before(() => {
      cy.createPlaylist(inputData, 2)
    })

    it("正常にプレイリストが作成されること", () => {
      // 作成したプレイリストの確認 ------------------------------------------------
      cy.visit("/")
      cy.contains("プレイリスト").click()
      cy.contains("一覧").click({ force: true })

      cy.get('[data-testid="api-status-select"]').select("全て")

      cy.get('[data-testid="playlist-list-items"]')
        .contains(inputData.name)
        .click()

      // ドロワーの内容チェック
      const drawerSelector = '[data-testid="playlist-drawer-info"]'
      cy.get(drawerSelector).contains(inputData.name)
      cy.get(drawerSelector).contains("API公開中")
      cy.get(drawerSelector).contains("summary")
      cy.get(drawerSelector).contains("キャッチコピーはこちら")
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
      cy.get('[data-testid="markedHeader"]').should(
        "have.value",
        inputData.markedHeader
      )
      cy.get(".ce-paragraph").contains("test")
      cy.get(".image-tool__image-picture").should("have.lengthOf", 1)
      cy.get('[data-testid="markedFooter"]').should(
        "have.value",
        inputData.markedFooter
      )
      cy.get('[data-testid="authorName"]').should(
        "have.value",
        inputData.authorName
      )
      cy.get('[data-testid="publisherName"]').should(
        "have.value",
        inputData.publisherName
      )

      // 基本情報(NSeries) タブ
      cy.contains("基本情報(NSeries)").click()
      cy.get('[data-testid="name"]').should("have.value", inputData.name)
      cy.get('[data-testid="detailedNameRuby"]').should(
        "have.value",
        inputData.detailedNameRuby
      )
      cy.get('[data-testid="detailedCatch"]').should(
        "have.value",
        inputData.detailedCatch
      )
      cy.get('[data-testid="description"]').should(
        "have.value",
        inputData.description
      )
      cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード1")
      cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード2")

      cy.get('[data-testid="hashtags-input-wrapper"]').contains(
        "#ハッシュタグ1"
      )

      cy.get('[data-testid="select-formatGenreCode"]').contains(
        inputData.formatGenre
      )
      cy.get('[data-testid="select-themeGenreCode"]').contains(
        inputData.themeGenre
      )
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
        "#84919e"
      )
      cy.get('[data-testid="adjusted-color-text-primaryDark"]').contains(
        "#84919e"
      )
      cy.get('[data-testid="adjusted-color-text-linkLight"]').contains(
        "#6a757f"
      )
      cy.get('[data-testid="adjusted-color-text-linkDark"]').contains(
        "#84919e"
      )
      // SameAs
      cy.get('[data-testid="sameAsAttributes.0.name"]').should(
        "have.value",
        inputData.sameAs[0].name
      )
      cy.get('[data-testid="sameAsAttributes.0.url"]').should(
        "have.value",
        inputData.sameAs[0].url
      )
      // Citation
      cy.get('[data-testid="citationsAttributes.0.name"]').should(
        "have.value",
        inputData.citation[0].name
      )
      cy.get('[data-testid="citationsAttributes.0.url"]').should(
        "have.value",
        inputData.citation[0].url
      )
      // エイリアスID
      cy.get('[data-testid="aliasId"]').should("have.value", inputData.aliasId)
      // API State
      cy.get('[data-testid="apiState"] input[type="checkbox"]').should(
        "be.checked"
      )
      cy.get('[data-testid="activeTvepisode"] input[type="checkbox"]').should(
        "be.checked"
      )
      cy.get('[data-testid="activeArticle"] input[type="checkbox"]').should(
        "be.checked"
      )
    })
  })
})
