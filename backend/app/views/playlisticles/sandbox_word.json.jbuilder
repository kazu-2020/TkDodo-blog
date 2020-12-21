# frozen_string_literal: true

json.playlisticle do
  json.headerSection build_header_section(@playlist)
  json.bodySections do
    json.array! build_episode_sections(@playlist)
  end
  json.footerSection build_footer_section
end
