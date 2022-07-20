class Supervisor < ApplicationRecord
  belongs_to :person_organization_local, optional: true
  belongs_to :playlist, optional: true
end
