Dir.glob(File.join(Rails.root, 'db', 'fixtures', '*.rb')).each do |file|
  load(file)
end
