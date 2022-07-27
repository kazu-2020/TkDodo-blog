begin
  load(Rails.root.join('db', 'seeds', "#{Rails.env}.rb"))
rescue LoadError => e
  puts e.to_s
end
