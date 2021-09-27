class Embed::FeaturedItemData
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :url, :string
  attribute :name, :string
  attribute :logo_image_url, :string
  attribute :detailed_catch, :string
  attribute :key_color, :string
  attribute :episode_data

  alias title name
end
