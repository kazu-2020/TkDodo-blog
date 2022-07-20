class Supervisor < ApplicationRecord
  belongs_to :person_organization_local
  belongs_to :playlist
end
