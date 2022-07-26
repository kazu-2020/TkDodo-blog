begin
  WikidataJson.find_by(wikidata_id: 'Q187553').wikidata_properties.create!(
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
rescue => e
  puts "#{e.message}"
end
