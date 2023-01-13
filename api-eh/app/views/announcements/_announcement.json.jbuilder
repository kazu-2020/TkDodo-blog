json.extract! announcement, :id, :status, :contents
json.dateCreated announcement.created_at.in_time_zone('Asia/Tokyo').strftime('%Y-%m-%dT%H:%M:%S+09:00')
