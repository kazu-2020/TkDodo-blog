# ここから西川貴教のデータを作成
person_organization_local = PersonOrganizationLocal.create!(
  uuid: '89678CF2-2863-29F6-6079-721C96A104A0',
  role: 'Person',
  name: '西川 貴教',
  occupation: '歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント',
  description: '日本の歌手、タレント (1970- )',
  name_format: 1,
  family_name: '西川',
  given_name: '貴教',
  additional_name: '',
  name_ruby: 'にしかわ　たかのり',
  family_name_ruby: 'にしかわ',
  given_name_ruby: 'たかのり',
  additional_name_ruby: '',
  image_data: ''
)

begin
  Supervisor.create!(
    person_organization_local_id: person_organization_local.id,
    playlist_id: Playlist.last.id,
    image_data: '',
    contents_type: 'Playlist',
    contents_type_id: 1
  )
rescue
  puts 'プレイリストが存在しないためデータの作成に失敗しました。'
end

wikidata_json = WikidataJson.create!(
  wikidata_id: 'Q187553',
  basic_json: File.read(Rails.root.join('db', 'jsons', 'Q187553_basic_wikidata.json')),
  property_json: File.read(Rails.root.join('db', 'jsons', 'Q187553_property_wikidata.json'))
)

ViafJson.create!(
  viaf_id: '44068140',
  json: File.read(Rails.root.join('db', 'jsons', '44068140_viaf.json'))
)

PersonOrganizationGlobal.create!(
  uuid: '89678CF2-2863-29F6-6079-721C96A104A0',
  viaf_id: '44068140',
  viaf_name: '西川 貴教',
  wikidata_id: 'Q187553',
  wikidata_name: '西川 貴教',
  wikidata_occupation: '歌手,日本の声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント',
  wikidata_image_url: 'https://commons.wikimedia.org/wiki/File:T.M._Revolution_at_MTV_VMAJ_2014.jpg',
  wikidata_description: '日本の歌手、タレント (1970- )',
  wikidata_alias: false
)

SearchPersonsOrganization.create!(
  uuid: '89678CF2-2863-29F6-6079-721C96A104A0',
  names: 'T.M.Revolution, Nishikawa Takanori'
)

wikidata_json.wikidata_properties.create!(
  [
    {
      wikidata_id: 'Q177220',
      name: '歌手'
    },
    {
      wikidata_id: 'Q622807',
      name: '日本の声優'
    },
    {
      wikidata_id: 'Q33999',
      name: '俳優'
    },
    {
      wikidata_id: 'Q183945',
      name: 'レコード・プロデューサー'
    },
    {
      wikidata_id: 'Q2722764',
      name: 'ラジオパーソナリティ'
    },
    {
      wikidata_id: 'Q822146',
      name: '作詞家'
    },
    {
      wikidata_id: 'Q829',
      name: 'タレント'
    }
  ]
)

person_organization_local2 = PersonOrganizationLocal.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  role: 'Organization',
  name: 'T.M. Revolution',
  occupation: '',
  description: '西川貴教ひとりからなる日本のソロユニット (1996 - )',
  name_format: 1,
  family_name: '',
  given_name: '',
  additional_name: '',
  name_ruby: '',
  family_name_ruby: '',
  given_name_ruby: '',
  additional_name_ruby: '',
  image_data: ''
)

# ここからT.M.Revolutionのデータを作成
begin
  Supervisor.create!(
    person_organization_local_id: person_organization_local2.id,
    playlist_id: Playlist.last.id,
    image_data: '',
    contents_type: 'Playlist',
    contents_type_id: 1
  )
rescue
  puts 'プレイリストが存在しないためデータの作成に失敗しました。'
end

wikidata_json2 = WikidataJson.create!(
  wikidata_id: 'Q14438405',
  basic_json: File.read(Rails.root.join('db', 'jsons', 'Q14438405_basic_wikidata.json')),
  property_json: File.read(Rails.root.join('db', 'jsons', 'Q14438405_property_wikidata.json'))
)

ViafJson.create!(
  viaf_id: '9877151778245518130005',
  json: File.read(Rails.root.join('db', 'jsons', '257886590_viaf.json'))
)

PersonOrganizationGlobal.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  viaf_id: '257886590',
  viaf_name: 'T. M. Revolution, 1970-',
  wikidata_id: 'Q14438405',
  wikidata_name: 'T.M. Revolution',
  wikidata_occupation: '',
  wikidata_image_url: 'https://commons.wikimedia.org/wiki/File:T.M._Revolution_at_MTV_VMAJ_2014.jpg',
  wikidata_description: '西川貴教ひとりからなる日本のソロユニット (1996 - )',
  wikidata_alias: false
)

SearchPersonsOrganization.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  names: 'TMR'
)

WikidataSameAs.create!(
  wikidata_id: 'Q14438405',
  wikidata_json_id: wikidata_json.id,
  same_as_wikidata_id: 'Q187553'
)

WikidataSameAs.create!(
  wikidata_id: 'Q187553',
  wikidata_json_id: wikidata_json2.id,
  same_as_wikidata_id: 'Q14438405'
)
