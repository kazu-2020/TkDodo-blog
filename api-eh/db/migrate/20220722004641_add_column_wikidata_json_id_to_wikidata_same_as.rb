class AddColumnWikidataJsonIdToWikidataSameAs < ActiveRecord::Migration[7.0]
  def change
    add_column :wikidata_same_as, :wikidata_json_id, :bigint, after: :wikidata_id
  end
end
