begin
  load(Rails.root.join('db', 'seeds', "#{Rails.env}.rb"))
rescue LoadError => e
  puts e.message.to_s
end
