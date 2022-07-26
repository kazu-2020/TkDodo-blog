begin
  WikidataJson.create!(
    wikidata_id: 'Q187553',
    basic_json: File.read(Rails.root.join('db', 'jsons', 'Q187553_basic_wikidata.json')),
    property_json: File.read(Rails.root.join('db', 'jsons', 'Q187553_property_wikidata.json'))
  )
rescue => e
  puts "#{e.message}"
end

begin
  WikidataJson.create!(
    wikidata_id: 'Q14438405',
    basic_json: File.read(Rails.root.join('db', 'jsons', 'Q14438405_basic_wikidata.json')),
    property_json: File.read(Rails.root.join('db', 'jsons', 'Q14438405_property_wikidata.json'))
  )
rescue => e
  puts "#{e.message}"
end
