image = File.open(Rails.root.join('db', 'images', 'sample.jpg'))
uploaded_image = Shrine.upload(image, :store, metadata: false)

playlist = Playlist.create!(
  name: 'Awesome Name',
  detailed_name_ruby: 'オウサム ネーム',
  description: '説明テキストが入ります',
  headline: 'ヘッドラインのテキストが入ります',
  selected_palette: '#ffffff',
  api_state: 'open',
  alias_id: 'ALIAS-ID-1',
  logo_image_data: uploaded_image.to_json,
  eyecatch_image_data: uploaded_image.to_json,
  hero_image_data: uploaded_image.to_json
)

person_organization_local = PersonOrganizationLocal.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  role: 'Person',
  name: '森田一義',
  occupation: 'お笑いタレント,テレビ司会者,作詞家,作曲家,実業家,著作家,歌手,俳優',
  description: '日本のお笑いタレント、司会者',
  name_format: 1,
  family_name: '森田',
  given_name: '一義',
  additional_name: '',
  name_ruby: 'もりた かずよし',
  family_name_ruby: 'もりた',
  given_name_ruby: 'かずよし',
  additional_name_ruby: '',
  image_data: ''
)

Supervisor.create!(
  person_organization_local_id: person_organization_local.id,
  playlist_id: playlist.id,
  image_data: '',
  contents_type: 'Playlist',
  contents_type_id: 1
)

wikidata_json = WikidataJson.create!(
  wikidata_id: 'Q850746',
  basic_json: File.read(Rails.root.join('db', 'jsons', 'Q36180_basic_wikidata.json')),
  property_json: File.read(Rails.root.join('db', 'jsons', 'Q36180_property_wikidata.json'))
)

ViafJson.create!(
  viaf_id: '251390810',
  json: File.read(Rails.root.join('db', 'jsons', '251390810_viaf.json'))
)

PersonOrganizationGlobal.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  viaf_id: '251390810',
  viaf_name: '森田一義',
  wikidata_id: 'Q850746',
  wikidata_name: '森田一義',
  wikidata_occupation: 'お笑いタレント,テレビ司会者,作詞家,作曲家,実業家,著作家,歌手,俳優',
  wikidata_image_url: '',
  wikidata_description: '日本のお笑いタレント、司会者',
  wikidata_alias: false
)

SearchPersonsOrganization.create!(
  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
  names: 'タモリ,タモリさん,タモさん,Kazuyoshi Morita,森田一義'
)

wikidata_json.wikidata_properties.create!(
  [
    {
      wikidata_id: 'Q43845',
      name: '実業家'
    },
    {
      wikidata_id: 'Q12330954',
      name: 'お笑いタレント'
    },
    {
      wikidata_id: 'Q947873',
      name: 'テレビ司会者'
    },
    {
      wikidata_id: 'Q822146',
      name: '作詞家'
    },
    {
      wikidata_id: 'Q36834',
      name: '作曲家'
    },
    {
      wikidata_id: 'Q33999',
      name: '俳優'
    },
    {
      wikidata_id: 'Q177220',
      name: '歌手'
    },
    {
      wikidata_id: 'Q36180',
      name: '著作家'
    }
  ]
)
