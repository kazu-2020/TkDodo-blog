begin
  SearchPersonsOrganization.create!(
    uuid: '89678CF2-2863-29F6-6079-721C96A104A0',
    names: 'T.M.Revolution, Nishikawa Takanori'
  )
rescue => e
  puts "#{e.message}"
end

begin
  SearchPersonsOrganization.create!(
    uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11',
    names: 'TMR'
  )
rescue => e
  puts "#{e.message}"
end
