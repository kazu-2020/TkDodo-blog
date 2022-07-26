begin
  ViafJson.create!(
    viaf_id: '44068140',
    json: File.read(Rails.root.join('db', 'jsons', '44068140_viaf.json'))
  )
rescue => e
  puts "#{e.message}"
end

begin
  ViafJson.create!(
    viaf_id: '9877151778245518130005',
    json: File.read(Rails.root.join('db', 'jsons', '257886590_viaf.json'))
  )
rescue => e
  puts "#{e.message}"
end
