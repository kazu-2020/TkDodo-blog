import { playlistInput } from "../../fixtures/formInput"

describe("プレイリスト更新", () => {
  before(() => {
    cy.deleteAllPlaylists()
    cy.createPlaylist({ name: "テストプレイリスト" }, 2)
  })

  context("全項目を更新した場合", () => {
    const inputData = playlistInput({
      name: "テストプレイリスト2",
      detailedCatch: "キャッチコピーはこちら2",
      detailedNameRuby: "てすとぷれいりすと2",
      description: "説明2",
      keywords: "キーワード3{enter}",
      hashTags: "#ハッシュタグ2{enter}",
      formatGenre: "ドキュメンタリー",
      themeGenre: "音楽全般",
      sameAs: [{ name: "same-as2", url: "https://example2.com" }],
      citation: [{ name: "citation2", url: "https://example2.com" }],
      aliasId: "alias-0000",
      markedHeader: "ヘッダー2",
      markedFooter: "フッター2",
      authorName: "author",
      publisherName: "publisher",
    })

    before(() => {
      cy.visit("/")
      cy.contains("プレイリスト").click()
      cy.contains("一覧").click({ force: true })

      cy.get('[data-testid="api-status-select"]').select("全て")

      cy.get('[data-testid="playlist-list-items"]')
        .contains("テストプレイリスト")
        .click()
      cy.get('[data-testid="playlist-drawer-edit-button"]').click()

      // リスト(NItemList)の編集 ------------------------------------------------
      cy.contains("リスト(NItemList)").click()

      // エピソードを1件削除
      cy.get('[data-testid="edit-episode-list"] [aria-label="削除"]')
        .first()
        .click()

      cy.get('[data-testid="edit-episode-list"]')
        .contains("プレイリストを追加してください")
        .should("not.exist")

      // 記事(NArticle)の編集 --------------------------------------------------
      cy.contains("記事(NArticle)").click()

      cy.get('[data-testid="markedHeader"]')
        .clear()
        .type(inputData.markedHeader)

      // paragraph
      cy.get("#editorjs").get("div.ce-block").click().type("test{enter}")
      // 画像をペースト
      cy.get(".ce-paragraph").last().paste({
        "text/plain": "https://picsum.photos/200.jpg",
      })
      cy.get(".image-tool__image-picture")
        .should("have.attr", "src")
        .should("include", "article_images")

      cy.get('[data-testid="markedFooter"]')
        .clear()
        .type(inputData.markedFooter)

      // 著者の変更
      cy.get('[data-testid="authorType-radio-group"]')
        .contains("個人(Person)")
        .click()
      cy.get('[data-testid="authorName"]').clear().type(inputData.authorName)

      // 発行者の変更
      cy.get('[data-testid="publisherType-radio-group"]')
        .contains("個人(Person)")
        .click()
      cy.get('[data-testid="publisherName"]')
        .clear()
        .type(inputData.publisherName)

      // 基本情報(NSeries)の編集 ------------------------------------------------
      cy.contains("基本情報(NSeries)").click()

      // 基本情報(NSeries) タブ
      cy.contains("基本情報(NSeries)").click()
      cy.get('[data-testid="name"]').clear().type(inputData.name)
      cy.get('[data-testid="detailedNameRuby"]')
        .clear()
        .type(inputData.detailedNameRuby)
      cy.get('[data-testid="detailedCatch"]')
        .clear()
        .type(inputData.detailedCatch)
      cy.get('[data-testid="description"]').clear().type(inputData.description)
      cy.get('[data-testid="keywords-input-wrapper"] input[type=text]').type(
        inputData.keywords,
        { force: true }
      )
      cy.get('[data-testid="hashtags-input-wrapper"] input[type="text"]').type(
        inputData.hashTags,
        { force: true }
      )

      cy.get("#formatGenreCode").type(
        `${inputData.formatGenre}{enter}{enter}`,
        {
          force: true,
        }
      )
      cy.get("#themeGenreCode").type(`${inputData.themeGenre}{enter}{enter}`, {
        force: true,
      })
      inputData.sameAs.forEach((sameAs, index) => {
        cy.get('[data-testid="add-same-as-button"]').click()
        cy.get(`[data-testid="sameAsAttributes.${index}.name"]`).type(
          sameAs.name
        )
        cy.get(`[data-testid="sameAsAttributes.${index}.url"]`).type(
          sameAs.url
        )
      })
      inputData.citation.forEach((citation, index) => {
        cy.get('[data-testid="add-citation-button"]').click()
        cy.get(`[data-testid="citationsAttributes.${index}.name"]`).type(
          citation.name
        )
        cy.get(`[data-testid="citationsAttributes.${index}.url"]`).type(
          citation.url
        )
      })
      cy.get('[data-testid="aliasId"]').clear().type(inputData.aliasId)

      cy.get('[data-testid="activeArticle"] input[type="checkbox"]').check({
        force: true,
      })

      cy.contains("保存する").click({ force: true })
      cy.contains("保存しました", { timeout: 10000 })
    })

    it("プレイリストの内容が正しいこと", () => {
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
      cy.get('[data-testid="radio-authorType-person"]')
        .siblings('input[type="radio"]')
        .should("be.checked")
      cy.get('[data-testid="authorName"]').should(
        "have.value",
        inputData.authorName
      )
      cy.get('[data-testid="radio-publisherType-person"]')
        .siblings('input[type="radio"]')
        .should("be.checked")
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
      cy.get('[data-testid="keywords-input-wrapper"]').contains("キーワード3")

      cy.get('[data-testid="hashtags-input-wrapper"]').contains(
        "#ハッシュタグ2"
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
