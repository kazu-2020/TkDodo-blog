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
    get 'pl/:playlist_id', to: 'playlists#show'
    get 'ts/:series_id/episode/te/:episode_id', to: 'episodes#show'
    get 'te/:episode_id/howto/:id', to: 'howtos#show'
    get 'te/:episode_id/event/:id', to: 'events#show'
    get 'te/:episode_id/faqpage/:id', to: 'faqpages#show'
  end

  get '/richlink', to: 'richlink#index'

  get 'oembed_debugger/summary'
  get 'oembed_debugger/featured_item'
  get 'oembed_debugger/item_list'
  get 'oembed_debugger/large_image'

  post '/slack/incoming_webhook', to: 'slack#incoming_webhook', format: 'json'
  get '/editor/fetch_link', to: 'editors#fetch_link', as: :fetch_link_editor, format: 'json'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'healthcheck', to: 'healthcheck#show'

  require 'sidekiq/web'
  EditorialHandsAPI::Application.routes.draw do
    mount Sidekiq::Web => '/sidekiq'
  end
end
