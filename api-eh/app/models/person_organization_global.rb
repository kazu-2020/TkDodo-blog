class PersonOrganizationGlobal < ApplicationRecord
  belongs_to :viaf_json, optional: true
  belongs_to :wikidata_json, optional: true
end
