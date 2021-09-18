class Embed::FeaturedItemData
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :url, :string
  attribute :series_name, :string
  attribute :series_logo_image_url, :string
  attribute :series_detailed_catch, :string
  attribute :episode_name, :string
  attribute :episode_eyecatch_image_url, :string

  alias title series_name
end
