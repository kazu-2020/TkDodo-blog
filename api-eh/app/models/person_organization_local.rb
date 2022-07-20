class PersonsOrganizationLocal < ApplicationRecord
  has_many :supervisors, dependent: :destroy
end
