# frozen_string_literal: true

Jets.application.routes.draw do
  root 'welcome#index'

  scope prefix: :'d6.6' do
    scope prefix: :t do
      scope prefix: :nplaylist do
        get 'pl/:playlist_id', to: 'external/playlists#show'
        get 'id/:playlist_uid', to: 'external/playlists#show'
      end

      scope prefix: :ndeck do
        get 'dk/:deck_id', to: 'external/decks#show', constraints: { deck_id: /recommend-(visible|editorial)$/ }
        get 'recommend/:deck_id', to: 'external/decks#show'
      end

      scope prefix: :bundle do
        get 'pl/:playlist_id', to: 'external/playlists#bundle'
      end
    end

    scope prefix: :l do
      scope prefix: :bundle do
        get 'pl/:playlist_id', to: 'external/playlists#list_bundle'
        get 'id/:playlist_uid', to: 'external/playlists#list_bundle'
      end
    end
  end

  resources :playlists, except: %i[new edit] do
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

    resources :playlist_items, only: [:index] do
      collection do
        post :bulk_update
      end
    end
  end

  resources :episodes, only: [] do
    collection do
      get :search
      get :bundle_items
    end

    member do
      get :bundle
      get :playlists
    end
  end

  resources :playlisticles, only: [] do
    collection do
      get :sandbox
      get :sandbox2
      get :sandbox_word
    end
  end

  get '/oembed', to: 'oembed#index'
  namespace :embed do
    get 'ts/:series_id', to: 'series#show'
    get 'ts/:series_id/episode/te/:episode_id', to: 'episodes#show'
    get 'te/:episode_id/howto/:id', to: 'howtos#show'
    get 'te/:episode_id/event/:id', to: 'events#show'
    get 'te/:episode_id/faqpage/:id', to: 'faqpages#show'
  end

  post '/slack/incoming_webhook', to: 'slack#incoming_webhook'
  get '/editor/fetch_link', to: 'editors#fetch_link', as: :fetch_link_editor

  # The jets/public#show controller can serve static utf8 content out of the public folder.
  # Note, as part of the deploy process Jets uploads files in the public folder to s3
  # and serves them out of s3 directly. S3 is well suited to serve static assets.
  # More info here: https://rubyonjets.com/docs/extras/assets-serving/
  any '*catchall', to: 'welcome#index'
end
