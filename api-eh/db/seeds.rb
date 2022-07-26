Dir.glob(File.join(Rails.root, 'db', 'fixtures', "#{Rails.env}", '*.rb')).each do |file|
  puts "Seeding： #{file}"
  load(file)
  puts "Seeded： #{file}"
end
