class Embed::ItemListData
  include ActiveModel::Model
  include ActiveModel::Attributes

  MAX_EPISODE_SIZE = 100

  attribute :url, :string
  attribute :name, :string
  attribute :hero_image_url, :string
  attribute :key_color, :string
  attribute :episodes # @type [Array] episodes EpisodeのHash（APIのレスポンス）の配列

  alias title name

  def base64_image_src
    return if hero_image_url.blank?

    "data:image/png;base64,#{Base64.strict_encode64(URI.open(hero_image_url).read)}" # rubocop:disable Security/Open
  end
end
