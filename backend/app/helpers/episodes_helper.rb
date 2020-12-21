# frozen_string_literal: true

module EpisodesHelper
  def recipes_json
    [
      {
        name: '新ごぼうのフレッシュきんぴら',
        image: [
          'https://www.kyounoryouri.jp/upfile/new_xl_1587082779_604.jpg'
        ],
        datePublished: '2012-07-13',
        description: '上品な香りとシャキシャキとした食感が特徴の新ごぼう。 サッと炒め、味つけも控えめにすることで、サラダのようなみずみずしさに。',
        cookTime: 'PT15M',
        dateModified: '2018-02-25',
        url: 'https://www.kyounoryouri.jp/recipe/44610_%E6%96%B0%E3%81%94%E3%81%BC%E3%81%86%E3%81%AE%E3%83%95%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A5%E3%81%8D%E3%82%93%E3%81%B4%E3%82%89.html'
      }
    ].to_json
  end

  # rubocop:disable Metrics/MethodLength, Layout/LineLength
  def howtos_json
    [
      {
        url: 'https://www.nhk.or.jp/lifestyle/article/detail/00906.html',
        name: 'アイスが溶けそう～！myボトルマーカーの作り方',
        description: 'ペットボトルのふたにつけて、自分の物だと一目でわかるようにするボトルマーカー。アイスをモチーフにした遊び心あふれる形で作ってみませんか。材料は100円ショップでも手に入るプラスチック粘土。お湯で柔らかくして形を作っていきます。',
        image: [
          {
            url: 'https://www.nhk.or.jp/lifestyle/article/detail/gpsf94000000gwzg-img/hero.jpg',
            name: 'eycatch_ht',
            width: '1920',
            height: '1080',
            thumbnail: [
              {
                url: 'https://www.nhk.or.jp/lifestyle/article/detail/gpsf94000000gwzg-img/hero.jpg',
                name: 'eycatch_ht_m',
                width: '640',
                height: '360'
              }
            ]
          }
        ],
        step: [
          {
            name: 'かたまった下半身をほぐすストレッチ',
            itemListElement: [
              {
                position: 1,
                name: '◆お尻のストレッチ'
              },
              {
                position: 2,
                name: '◆股関節のストレッチ'
              },
              {
                position: 3,
                name: '◆XXのストレッチ'
              }
            ]
          }
        ]
      }
    ].to_json
  end

  def event_json
    [
      {
        type: 'Event',
        id: '76',
        name: '講演会「『ＮＨＫのど自慢』～長寿番組、その制作の舞台裏',
        description: '歌にまつわる思い出とともに、その土地に生きる人々の暮らしぶりや地域性を、全国各地から“出場者の歌”を通じてお届けしている「ＮＨＫのど自慢」。放送開始から７０年以上の歴史を有する番組の魅力や、制作の舞台裏などをＮＨＫエンターテインメント番組部の代田一貴プロデューサーが語ります。',
        startDate: '2020-08-23T10:00:00+09:00',
        endDate: '2020-08-23T13:00:00+09:00',
        address: '東京都港区愛宕2-1-1',
        location: 'ＮＨＫ放送博物館',
        dateCreated: '2020-05-13T11:44:24+09:00',
        dateModified: '2020-05-13T11:44:35+09:00',
        offersValidFrom: '2020-05-11T00:00:00+09:00',
        offersValidThrough: '2020-05-13T00:00:00+09:00',
        offersSameAs: '',
        url: 'https://developer.dlab.nhk.or.jp/aw-site-web2/ts/N8GR183W9M/event'
      }
    ].to_json
  end
  # rubocop:enable Metrics/MethodLength, Layout/LineLength
end
