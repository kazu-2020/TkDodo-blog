begin
  PersonOrganizationLocal.find_by(  uuid: '89678CF2-2863-29F6-6079-721C96A104A0').supervisors.create!(
    person_organization_local_id: PersonOrganizationLocal.find_by(  uuid: '89678CF2-2863-29F6-6079-721C96A104A0').id,
    playlist_id: Playlist.first.id,
    image_data: '',
    contents_type: 'Playlist',
    contents_type_id: 1
  )
rescue => e
  puts "#{e.message}"
end

begin
  PersonOrganizationLocal.find_by(  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11').supervisors.create!(
    person_organization_local_id: PersonOrganizationLocal.find_by(  uuid: 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11').id,
    playlist_id: Playlist.last.id,
    image_data: '',
    contents_type: 'Playlist',
    contents_type_id: 1
  )
rescue => e
  puts "#{e.message}"
end
