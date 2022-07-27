class WikidataSameAs < ApplicationRecord
  belongs_to :wikidata_json, optional: true
end
