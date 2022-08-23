class ChangeColumnsNameToPlaylists < ActiveRecord::Migration[7.0]
  def change
    rename_column :playlists, :active_how_to, :active_howto
    rename_column :playlists, :active_faq_page, :active_faqpage
    rename_column :playlists, :active_episode, :active_tvepisode
    change_column_comment :playlists, :active_howto, from: 'how_to の入力がアクティブかどうか', to: 'howto の入力がアクティブかどうか'
    change_column_comment :playlists, :active_faqpage, from: 'faq_page の入力がアクティブかどうか', to: 'faqpage の入力がアクティブかどうか'
    change_column_comment :playlists, :active_tvepisode, from: 'episode の入力がアクティブかどうか', to: 'tvepisode の入力がアクティブかどうか'
  end
end
