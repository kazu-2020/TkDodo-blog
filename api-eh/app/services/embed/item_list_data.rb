class Embed::ItemListData
  include ActiveModel::Model
  include ActiveModel::Attributes

  MAX_EPISODE_SIZE = 3

  attribute :url, :string
  attribute :name, :string
  attribute :hero_image_url, :string
  attribute :key_color, :string
  attribute :episodes # @type [Array] episodes EpisodeのHash（APIのレスポンス）の配列

  alias title name
end
