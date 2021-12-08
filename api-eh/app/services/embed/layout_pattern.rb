class Embed::LayoutPattern
  DEFAULT_SIZE = {
    summary: { height: 210, width: '100%' },
    featuredItem: { height: 385, width: '240' },
    itemList: { height: 210, width: '240' },
    largeImage: { height: 360, width: '640' }
  }.freeze

  TYPES = %w[summary largeImage featuredItem itemList].freeze

  # @param [String] pattern
  def self.exist_pattern?(pattern)
    TYPES.include?(pattern)
  end
end
