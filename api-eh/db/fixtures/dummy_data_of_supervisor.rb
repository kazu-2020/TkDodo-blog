# プレイリストのseedデータを作成していないため暫定的にエラーを回避しています。実行時は環境にプレイリストが2件以上存在することを確認してください。
if Playlist.count < 2
  p 'プレイリストが2件未満のためデータを作成できませんでした。'
  return
end

# ここから西川貴教のデータを作成
person_organization_local = PersonOrganizationLocal.find_or_create_by(uuid: '89678CF2-2863-29F6-6079-721C96A104A0') do |person_organization_local|
  person_organization_local.uuid = '89678CF2-2863-29F6-6079-721C96A104A0'
  person_organization_local.role = 'Person'
  person_organization_local.name = '西川 貴教'
  person_organization_local.occupation = '歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント'
  person_organization_local.description = '日本の歌手、タレント (1970- )'
  person_organization_local.name_format = 1
  person_organization_local.family_name = '西川'
  person_organization_local.given_name = '貴教'
  person_organization_local.additional_name = ''
  person_organization_local.name_ruby = 'にしかわ　たかのり'
  person_organization_local.family_name_ruby = 'にしかわ'
  person_organization_local.given_name_ruby = 'たかのり'
  person_organization_local.additional_name_ruby = ''
  person_organization_local.image_data = ''
end

Supervisor.find_or_create_by(person_organization_local_id: person_organization_local.id) do |supervisor|
  supervisor.person_organization_local_id = person_organization_local.id
  supervisor.playlist_id = Playlist.first.id
  supervisor.image_data = ''
  supervisor.contents_type = 'Playlist'
  supervisor.contents_type_id = 1
end


wikidata_json = WikidataJson.find_or_create_by(wikidata_id: 'Q187553') do |wikidata_json|
  wikidata_json.wikidata_id = 'Q187553'
  wikidata_json.basic_json = File.read(Rails.root.join('db', 'jsons', 'Q187553_basic_wikidata.json'))
  wikidata_json.property_json = File.read(Rails.root.join('db', 'jsons', 'Q187553_property_wikidata.json'))
end

ViafJson.find_or_create_by(viaf_id: '44068140') do |viaf_json|
  viaf_json.viaf_id = '44068140'
  viaf_json.json = File.read(Rails.root.join('db', 'jsons', '44068140_viaf.json'))
end

PersonOrganizationGlobal.find_or_create_by(uuid: '89678CF2-2863-29F6-6079-721C96A104A0') do |person_organization_global|
  person_organization_global.uuid = '89678CF2-2863-29F6-6079-721C96A104A0'
  person_organization_global.viaf_id = '44068140'
  person_organization_global.viaf_name = '西川 貴教'
  person_organization_global.wikidata_id = 'Q187553'
  person_organization_global.wikidata_name = '西川 貴教'
  person_organization_global.wikidata_occupation = '歌手,日本の声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント'
  person_organization_global.wikidata_image_url = 'https://commons.wikimedia.org/wiki/File:T.M._Revolution_at_MTV_VMAJ_2014.jpg'
  person_organization_global.wikidata_description = '日本の歌手、タレント (1970- )'
  person_organization_global.wikidata_alias = false
end

SearchPersonsOrganization.find_or_create_by(uuid: '89678CF2-2863-29F6-6079-721C96A104A0') do |search_persons_organization|
  search_persons_organization.uuid = '89678CF2-2863-29F6-6079-721C96A104A0'
  search_persons_organization.names = 'T.M.Revolution, Nishikawa Takanori'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q177220') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q177220'
  wikidata_property.name = '歌手'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q622807') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q622807'
    wikidata_property.name = '日本の声優'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q33999') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q33999'
    wikidata_property.name = '俳優'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q183945') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q183945'
    wikidata_property.name = 'レコード・プロデューサー'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q2722764') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q2722764'
    wikidata_property.name = 'ラジオパーソナリティ'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q822146') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q822146'
    wikidata_property.name = '作詞家'
end

wikidata_json.wikidata_properties.find_or_create_by(wikidata_json_id: 'Q829146') do |wikidata_property|
  wikidata_property.wikidata_id = 'Q829146'
    wikidata_property.name = 'タレント'
end

# ここからT.M.Revolutionのデータを作成
person_organization_local2 = PersonOrganizationLocal.find_or_create_by(uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11')  do |person_organization_local|
  person_organization_local.uuid = 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'
  person_organization_local.role = 'Organization'
  person_organization_local.name = 'T.M. Revolution'
  person_organization_local.occupation = ''
  person_organization_local.description = '西川貴教ひとりからなる日本のソロユニット (1996 - )'
  person_organization_local.name_format = 1
  person_organization_local.family_name = ''
  person_organization_local.given_name = ''
  person_organization_local.additional_name = ''
  person_organization_local.name_ruby = ''
  person_organization_local.family_name_ruby = ''
  person_organization_local.given_name_ruby = ''
  person_organization_local.additional_name_ruby = ''
  person_organization_local.image_data = ''
end

Supervisor.find_or_create_by(person_organization_local_id: person_organization_local2.id) do |supervisor|
  supervisor.person_organization_local_id = person_organization_local2.id
  supervisor.playlist_id = Playlist.last.id
  supervisor.image_data = ''
  supervisor.contents_type = 'Playlist'
  supervisor.contents_type_id = 1
end

wikidata_json2 = WikidataJson.find_or_create_by(wikidata_id: 'Q14438405') do |wikidata_json|
  wikidata_json.wikidata_id = 'Q14438405'
  wikidata_json.basic_json = File.read(Rails.root.join('db', 'jsons', 'Q14438405_basic_wikidata.json'))
  wikidata_json.property_json = File.read(Rails.root.join('db', 'jsons', 'Q14438405_property_wikidata.json'))
end

ViafJson.find_or_create_by(viaf_id: '9877151778245518130005') do |viaf_json|
  viaf_json.viaf_id = '9877151778245518130005'
  viaf_json.json = File.read(Rails.root.join('db', 'jsons', '257886590_viaf.json'))
end

PersonOrganizationGlobal.find_or_create_by(uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11') do |person_organization_global|
  person_organization_global.uuid = 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'
  person_organization_global.viaf_id = '257886590'
  person_organization_global.viaf_name = 'T. M. Revolution, 1970-'
  person_organization_global.wikidata_id = 'Q14438405'
  person_organization_global.wikidata_name = 'T.M. Revolution'
  person_organization_global.wikidata_occupation = ''
  person_organization_global.wikidata_image_url = 'https://commons.wikimedia.org/wiki/File:T.M._Revolution_at_MTV_VMAJ_2014.jpg'
  person_organization_global.wikidata_description = '西川貴教ひとりからなる日本のソロユニット (1996 - )'
  person_organization_global.wikidata_alias = false
end

SearchPersonsOrganization.find_or_create_by(uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11') do |search_persons_organization|
  search_persons_organization.uuid = 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'
  search_persons_organization.names = 'TMR'
end

WikidataSameAs.find_or_create_by(wikidata_id: 'Q14438405') do |wikidata_same_as|
  wikidata_same_as.wikidata_id = 'Q14438405'
  wikidata_same_as.wikidata_json_id = wikidata_json.id
  wikidata_same_as.same_as_wikidata_id = 'Q187553'
end

WikidataSameAs.find_or_create_by(wikidata_id: 'Q187553') do |wikidata_same_as|
  wikidata_same_as.wikidata_id = 'Q187553'
  wikidata_same_as.wikidata_json_id = wikidata_json2.id
  wikidata_same_as.same_as_wikidata_id = 'Q14438405'
end
