begin
  Dir.glob(File.join(Rails.root, 'db', 'fixtures', Rails.env.to_s, '*.rb')).each do |file|
    puts "Seeding： #{file}"
    load(file)
    puts "Seeded： #{file}"
  end
rescue LoadError => e
  puts e.to_s
end
