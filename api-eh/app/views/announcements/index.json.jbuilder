json.announcements do
  json.array! @announcements, partial: 'announcements/announcement', as: :announcement
end

json.partial! 'shared/pagination', record: @announcements
