# frozen_string_literal: true

class OembedController < ApplicationController
  def index
    render json: {
      version: "1.0",
      width: "100%",
      height: 243,
      type: "rich",
      provider_name: "example",
      provider_url: "https://example.com",
      url: "https://example.com/embed/123"
  }
  end
end
