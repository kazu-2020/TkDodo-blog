Dir.glob(File.join(Rails.root, 'db', 'fixtures', '*.rb')).each do |file|
  puts "Seeding #{file}"
  load(file)
  puts 'Done.'
end
