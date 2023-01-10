class Announcement < ApplicationRecord
  enum status: {
    general: 0,
    improved: 1,
    maintenance: 2,
    attentive: 3,
    emergency: 4
  }
end
