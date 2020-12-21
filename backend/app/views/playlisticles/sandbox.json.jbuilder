# frozen_string_literal: true

json.playlisticle do
  json.sections do
    json.array! build_editable_sections(@playlist)
  end
end
