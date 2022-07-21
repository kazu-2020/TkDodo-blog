class ViafJson < ApplicationRecord
  belongs_to :person_organization_global, optional: true
end
