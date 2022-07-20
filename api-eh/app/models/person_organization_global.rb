class PersonOrganizationGlobal < ApplicationRecord
  belongs_to :viaf_json
  belongs_to :wikidata_json
end
