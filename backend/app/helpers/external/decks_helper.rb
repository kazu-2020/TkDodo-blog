# frozen_string_literal: true

module External::DecksHelper
  def type_of_item(object_type)
    case object_type
    when 'broadcastevent' then 'BroadcastEvent'
    when 'videoobject' then 'VideoObject'
    else 'TVEpisode'
    end
  end

  def deck_url(deck, deck_id, object_type)
    case deck_id
    when /visible/
      "https://dev-api-eh.nr.nhk.jp/d6.6/t/ndeck/recommend/visible.json?area=#{deck.area}&type=#{object_type}"
    when /editorial/
      "https://dev-api-eh.nr.nhk.jp/d6.6/t/ndeck/recommend/editorial.json?area=#{deck.area}&type=#{object_type}"
    else
      ''
    end
  end
end
