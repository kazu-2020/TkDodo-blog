tables_name = %w[
  person_organization_locals supervisors wikidata_jsons viaf_jsons person_organization_globals
  search_persons_organizations wikidata_properties wikidata_same_as
]

tables_name.each do |table_name|
  path = Rails.root.join("db/fixtures/#{Rails.env}/#{table_name}.rb")
  puts "Seeding： #{table_name}"
  require path
end
