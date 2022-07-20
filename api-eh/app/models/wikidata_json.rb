class WikidataJson < ApplicationRecord
  has_many :wikidata_same_as
  has_many :wikidata_properties
  belongs_to :person_organization_global, optional: true
end
