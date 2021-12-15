class Embed::LayoutPattern
  DEFAULT_SIZE = {
    summary: { height: 210, width: '100%' },
    featuredItem: { height: 385, width: '240' },
    itemList: { height: 210, width: '240' },
    largeImage: { height: 360, width: '640' }
  }.freeze

  SUMMARY = 'summary'.freeze
  LARGE_IMAGE = 'largeImage'.freeze
  FEATURED_ITEM = 'featuredItem'.freeze
  ITEM_LIST = 'itemList'.freeze

  TYPES = [SUMMARY, LARGE_IMAGE, FEATURED_ITEM, ITEM_LIST].freeze

  # @param [String] pattern
  def self.exist_pattern?(pattern)
    TYPES.include?(pattern)
  end
end
