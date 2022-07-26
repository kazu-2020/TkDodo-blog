begin
  WikidataSameAs.create!(
    wikidata_id: 'Q14438405',
    wikidata_json_id: WikidataJson.find_by(wikidata_id: 'Q187553').id,
    same_as_wikidata_id: 'Q187553'
  )
rescue => e
  puts "#{e.message}"
end

begin
  WikidataSameAs.create!(
    wikidata_id: 'Q187553',
    wikidata_json_id: WikidataJson.find_by(wikidata_id: 'Q14438405').id,
    same_as_wikidata_id: 'Q14438405'
  )
rescue => e
  puts "#{e.message}"
end
