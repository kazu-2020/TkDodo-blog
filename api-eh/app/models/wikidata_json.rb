class WikidataJson < ApplicationRecord
  has_many :wikidata_same_as
  has_many :wikidata_properties
end
