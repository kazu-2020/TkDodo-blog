# frozen_string_literal: true

require 'jbuilder'
require 'multi_json'

class Jbuilder
  def set_raw!(attribute_name, json_string)
    set! attribute_name, ::MultiJson.load(json_string)
  end
end
