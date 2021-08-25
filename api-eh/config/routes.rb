Rails.application.routes.draw do
  root 'playlists#index', format: 'json'

  scope :'d6.6' do
    scope :t do
      scope :nplaylist do
        get 'pl/:playlist_id', to: 'external/playlists#show'
        get 'id/:playlist_uid', to: 'external/playlists#show'
      end

      scope :ndeck do
        get 'dk/:deck_id', to: 'external/decks#show', constraints: { deck_id: /recommend-(visible|editorial)(-r5)?/ }
        get 'recommend/:deck_id', to: 'external/decks#show'
      end

      scope :bundle do
        get 'pl/:playlist_id', to: 'external/playlists#bundle'
      end
    end

    scope :l do
      scope :bundle do
        get 'pl/:playlist_id/types', to: 'external/playlists#list_bundle'
        get 'id/:playlist_uid/types', to: 'external/playlists#list_bundle'
      end

      get 'tvepisode/pl/:playlist_id', to: 'external/playlists#episodes', as: :episodes_external_playlist
      get 'faqpage/pl/:playlist_id', to: 'external/playlists#faq_pages', as: :faqpages_external_playlist
      get 'event/pl/:playlist_id', to: 'external/playlists#events', as: :events_external_playlist
      get 'howto/pl/:playlist_id', to: 'external/playlists#howtos', as: :howtos_external_playlist
      get 'tvepisode/id/:playlist_uid', to: 'external/playlists#episodes', as: :episodes_external_playlist_uid
      get 'faqpage/id/:playlist_uid', to: 'external/playlists#faq_pages', as: :faqpages_external_playlist_uid
      get 'event/id/:playlist_uid', to: 'external/playlists#events', as: :events_external_playlist_uid
      get 'howto/id/:playlist_uid', to: 'external/playlists#howtos', as: :howtos_external_playlist_uid
    end
  end

  resources :playlists, except: %i[new edit], format: 'json' do
    collection do
      post :import_from_series
      post :upload_article_image_by_url
      post :upload_article_image_by_file
    end

    member do
      post :upload_article_image_by_url
      post :upload_article_image_by_file
      get :actors_and_contributors
    end

    resources :playlist_items, only: [:index], format: 'json' do
      collection do
        post :bulk_update
      end
    end
  end

  resources :episodes, only: [], format: 'json' do
    collection do
      get :search
      get :bundle_items
    end

    member do
      get :bundle
      get :playlists
    end
  end

  resources :related_playlists, only: :index, format: 'json'

  get '/oembed', to: 'oembed#index'
  namespace :embed do
    get 'ts/:series_id', to: 'series#show'
    get 'ts/:series_id/episode/te/:episode_id', to: 'episodes#show'
    get 'te/:episode_id/howto/:id', to: 'howtos#show'
    get 'te/:episode_id/event/:id', to: 'events#show'
    get 'te/:episode_id/faqpage/:id', to: 'faqpages#show'
  end

  get '/richlink', to: 'richlink#index'

  get 'oembed_debugger/summary'

  post '/slack/incoming_webhook', to: 'slack#incoming_webhook', format: 'json'
  get '/editor/fetch_link', to: 'editors#fetch_link', as: :fetch_link_editor, format: 'json'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'healthcheck', to: 'healthcheck#show'
end
