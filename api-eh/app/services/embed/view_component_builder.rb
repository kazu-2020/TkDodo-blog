class Embed::ViewComponentBuilder
  def initialize(resource_id:, height:, layout_pattern:)
    @resource_id = resource_id
    @layout_pattern = Embed::LayoutPattern.exist_pattern?(layout_pattern) ? layout_pattern : 'summary'
    @height = height || Embed::LayoutPattern::DEFAULT_SIZE[@layout_pattern.to_sym][:height]
  end

  def call
    case @layout_pattern
    when 'summary'
      build_summary_view_component
    when 'featuredItem'
      build_featured_item_view_component
    when 'itemList'
      build_item_list_view_component
    when 'largeImage'
      build_large_image_view_component
    end
  rescue DlabApiClient::NotFound
    nil
  end

  private

  def build_summary_view_component
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end

  def build_featured_item_view_component
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end

  def build_item_list_view_component
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end

  def build_large_image_view_component
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end
end
