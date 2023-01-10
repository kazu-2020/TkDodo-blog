json.announcements do
  json.array! @announcements, :id, :status, :contents, :created_at
end
