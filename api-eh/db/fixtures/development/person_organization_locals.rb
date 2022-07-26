begin
  PersonOrganizationLocal.create!(
    uuid: '89678CF2-2863-29F6-6079-721C96A104A0',
    role: 'Person',
    name: '西川 貴教',
    occupation: '歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント',
    description: '日本の歌手、タレント (1970- )',
    name_format: 1,
    family_name: '西川',
    given_name: '貴教',
    additional_name: '',
    name_ruby: 'にしかわ　たかのり',
    family_name_ruby: 'にしかわ',
    given_name_ruby: 'たかのり',
    additional_name_ruby: '',
    image_data: ''
  )
rescue => e
  puts "#{e.message}"
end

begin
  PersonOrganizationLocal.create!(
    uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
    role: 'Organization',
    name: 'T.M. Revolution',
    occupation: '',
    description: '西川貴教ひとりからなる日本のソロユニット (1996 - )',
    name_format: 1,
    family_name: '',
    given_name: '',
    additional_name: '',
    name_ruby: '',
    family_name_ruby: '',
    given_name_ruby: '',
    additional_name_ruby: '',
    image_data: ''
  )
rescue => e
  puts "#{e.message}"
end
