Rails.application.routes.draw do
  root 'welcome#index'

  scope :'d6.6', format: 'json' do
    scope :t do
      scope :nplaylist do
        get 'pl/:playlist_id', to: 'external/playlists#show'
        get 'id/:playlist_uid', to: 'external/playlists#show'
      end

      scope :ndeck do
        get 'dk/:deck_id', to: 'external/decks#show', constraints: { deck_id: /recommend-(visible|editorial)/ }
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

  resources :playlisticles, only: [], format: 'json' do
    collection do
      get :sandbox
      get :sandbox2
      get :sandbox_word
    end
  end

  ## 北村さんに確認
  get '/oembed', to: 'oembed#index'
  namespace :embed do
    get 'ts/:series_id', to: 'series#show'
    get 'ts/:series_id/episode/te/:episode_id', to: 'episodes#show'
    get 'te/:episode_id/howto/:id', to: 'howtos#show'
    get 'te/:episode_id/event/:id', to: 'events#show'
    get 'te/:episode_id/faqpage/:id', to: 'faqpages#show'
  end

  post '/slack/incoming_webhook', to: 'slack#incoming_webhook', format: 'json'
  get '/editor/fetch_link', to: 'editors#fetch_link', as: :fetch_link_editor, format: 'json'
end
