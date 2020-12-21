# frozen_string_literal: true

class ChangeAllowNullOnArticleImages < ActiveRecord::Migration[6.0]
  def change
    change_column_null :article_images, :playlist_id, true, nil
    add_column :article_images, :image_id, :string, after: :image_data, comment: 'Shrine が生成する画像ID'
    add_index :article_images, :image_id, name: 'idx_image_id'
  end
end
