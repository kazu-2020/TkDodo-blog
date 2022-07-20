class CreateSearchPersonsOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :search_persons_organizations do |t|
      t.string :uuid
      t.text :names, null: false, comment: 'wikidataのラベル・エイリアスとviafの名前とlocalの名前をマージした情報を検索用テキストとして保持させる'
      t.timestamps
    end
    add_index :search_persons_organizations, :uuid, unique: true
  end
end
