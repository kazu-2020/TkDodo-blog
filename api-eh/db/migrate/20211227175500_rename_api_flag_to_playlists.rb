class RenameApiFlagToPlaylists < ActiveRecord::Migration[6.1]
  def up
    rename_column :playlists, :output_item_list_to_bundle, :deliver_item_list_via_api
    rename_column :playlists, :output_episode_to_bundle, :deliver_episode_via_api
    rename_column :playlists, :output_faq_page_to_bundle, :deliver_faq_page_via_api
    rename_column :playlists, :output_article_to_bundle, :deliver_article_via_api
    rename_column :playlists, :output_how_to_to_bundle, :deliver_how_to_via_api
    rename_column :playlists, :output_event_to_bundle, :deliver_event_via_api
  end

  def down
    rename_column :playlists, :deliver_item_list_via_api, :output_item_list_to_bundle
    rename_column :playlists, :deliver_episode_via_api, :output_episode_to_bundle
    rename_column :playlists, :deliver_faq_page_via_api, :output_faq_page_to_bundle
    rename_column :playlists, :deliver_article_via_api, :output_article_to_bundle
    rename_column :playlists, :deliver_how_to_via_api, :output_how_to_to_bundle
    rename_column :playlists, :deliver_event_via_api, :output_event_to_bundle
  end
end
