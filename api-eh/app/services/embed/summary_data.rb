# Series, Playlistのsummaryの表示用データ
class Embed::SummaryData
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :url, :string
  attribute :name, :string
  attribute :eyecatch_image_url, :string
  attribute :description, :string

  alias title name
end
