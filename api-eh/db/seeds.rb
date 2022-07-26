tables_name = %w[
  person_organization_locals supervisors wikidata_jsons viaf_jsons person_organization_globals
  search_persons_organizations wikidata_properties wikidata_same_as
]

# 初期データ投入
prefix = 'input_init_data_to_'
tables_name.each do |table_name|
  path = Rails.root.join("db/fixtures/#{Rails.env}/#{prefix}#{table_name}.rb")
  if File.exist?(path)
    puts "Seeding： #{table_name}"
    require path
  else
    puts "Seeding： #{prefix}#{table_name} が存在しません"
  end
end
