begin
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
rescue => e
  puts "#{e.message}"
end

begin
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
rescue => e
  puts "#{e.message}"
end
