Rails.application.routes.draw do
  root 'playlists#index', format: 'json'

  resources :decks, only: %i[index show create update destroy], format: 'json' do
    member do
      get :playlists
    end
  end

  resources :series_decks, only: %i[index show create update destroy], format: 'json' do
    member do
      get :playlists
    end
  end

  resources :series_playlists, format: 'json' do
    member do
      get :episodes
    end

    collection do
      get :search
    end
  end

  resources :deck_labels, only: :index, format: 'json'

  resources :playlists, except: %i[new edit], format: 'json' do
    collection do
      post :upload_article_image_by_url
      post :upload_article_image_by_file
    end

    member do
      post :upload_article_image_by_url
      post :upload_article_image_by_file
      get :actors_and_contributors
      get :bundle_items
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
    end

    member do
      get :bundle
      get :playlists
    end
  end

  resources :announcements, only: %i[index create show update destroy], format: 'json'

  # Oktaとの連携用エンドポイント
  namespace :scim do
    namespace :v2 do
      mount Scimitar::Engine, at: '/'

      get    'Users',     to: 'users#index'
      get    'Users/:id', to: 'users#show'
      post   'Users',     to: 'users#create'
      put    'Users/:id', to: 'users#replace'
    end
  end

  resources :abilities, only: :index, format: 'json'

  resources :users, only: %i[index show], format: 'json'

  namespace :embed do
    get 'ts/:series_id', to: 'series#show'
    get 'pl/:playlist_id', to: 'playlists#show'
    get 'ts/:series_id/episode/te/:episode_id', to: 'episodes#show'
    get 'te/:episode_id/howto/:id', to: 'howtos#show'
    get 'te/:episode_id/event/:id', to: 'events#show'
    get 'te/:episode_id/faqpage/:id', to: 'faqpages#show'
  end

  post '/slack/incoming_webhook', to: 'slack#incoming_webhook', format: 'json'
  get '/editor/fetch_link', to: 'editors#fetch_link', as: :fetch_link_editor, format: 'json'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'healthcheck', to: 'healthcheck#show'

  require 'sidekiq/web'
  EditorialHandsAPI::Application.routes.draw do
    mount Sidekiq::Web => '/sidekiq'
  end
end
