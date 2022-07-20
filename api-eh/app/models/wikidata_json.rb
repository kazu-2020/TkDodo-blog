class WikidataJson < ApplicationRecord
  has_many :wikidata_same_as, dependent: :destroy
  has_many :wikidata_properties, dependent: :destroy
end
