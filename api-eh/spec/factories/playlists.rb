# frozen_string_literal: true

FactoryBot.define do
  factory :playlist do
    name { 'Awesome Name' }
    detailed_name_ruby { 'オウサム ネーム' }
    description { '説明テキストが入ります' }
    headline { 'ヘッドラインのテキストが入ります' }
    selected_palette { '#ffffff' }
    api_state { %i[open close waiting].sample }
    sequence(:alias_id) { |i| "ALIAS-ID#{i}" }
    publish_level { Playlist::PUBLISH_LEVELS.sample }
    logo_image_data { ImageData.image_data }
    eyecatch_image_data { ImageData.image_data }
    hero_image_data { ImageData.image_data }
    active_item_list { [true, false].sample }
    active_episode { [true, false].sample }
    active_faq_page { [true, false].sample }
    active_article { [true, false].sample }
    active_how_to { [true, false].sample }
    active_event { [true, false].sample }

    trait :with_same_as do
      after(:build) do |playlist|
        playlist.same_as = [FactoryBot.build(:same_as)]
      end
    end

    trait :with_playlist_item do
      after(:build) do |playlist|
        playlist.playlist_items << build(:playlist_item)
      end
    end

    trait :with_playlist_items do
      after(:build) do |playlist|
        2.times { playlist.playlist_items << build(:playlist_item) }
      end
    end

    trait :with_keywords do
      after(:build) do |playlist|
        2.times { playlist.playlist_keywords << build(:playlist_keyword) }
      end
    end

    trait :with_hashtags do
      after(:build) do |playlist|
        2.times { playlist.playlist_hashtags << build(:playlist_hashtag) }
      end
    end
  end
end
