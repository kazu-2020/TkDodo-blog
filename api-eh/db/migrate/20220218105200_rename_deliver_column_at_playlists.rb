class RenameDeliverColumnAtPlaylists < ActiveRecord::Migration[6.1]
  def change
    rename_column :playlists, :deliver_item_list_via_api, :active_item_list
    change_column_comment :playlists, :active_item_list, 'item_list の入力がアクティブかどうか'

    rename_column :playlists, :deliver_episode_via_api, :active_episode
    change_column_comment :playlists, :active_episode, 'episode の入力がアクティブかどうか'

    rename_column :playlists, :deliver_faq_page_via_api, :active_faq_page
    change_column_comment :playlists, :active_faq_page, 'faq_page の入力がアクティブかどうか'

    rename_column :playlists, :deliver_article_via_api, :active_article
    change_column_comment :playlists, :active_article, 'article の入力がアクティブかどうか'

    rename_column :playlists, :deliver_how_to_via_api, :active_how_to
    change_column_comment :playlists, :active_how_to, 'how_to の入力がアクティブかどうか'

    rename_column :playlists, :deliver_event_via_api, :active_event
    change_column_comment :playlists, :active_event, 'event の入力がアクティブかどうか'

    add_column :playlists, :available_acticle, :boolean, after: :editor_data, comment: 'artilce が available かどうか'
  end
end
