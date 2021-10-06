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

  def base64_image_src
    return if logo_image_url.blank?

    "data:image/png;base64,#{Base64.strict_encode64(URI.open(logo_image_url).read)}" # rubocop:disable Security/Open
  end
end
