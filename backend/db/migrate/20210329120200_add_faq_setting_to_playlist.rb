# frozen_string_literal: true

class AddFaqSettingToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :output_faq_page_to_bundle,
               :boolean, default: false, after: :output_episode_to_bundle, comment: 'bundle にてFAQを出力するかのフラグ'
  end
end
