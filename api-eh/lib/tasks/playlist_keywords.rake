namespace :playlist_keywords do
  desc 'キーワードに含まれる#を除去する'
  task trim_hash: :environment do
    playlist_keywords = PlaylistKeyword.all

    playlist_keywords.each do |playlist_keyword|
      playlist_keyword.name = playlist_keyword.name.gsub('#', '')
      playlist_keyword.save
    end
  end
end
