# frozen_string_literal: true

class EditorsController < ApplicationController
  # @editorjs/linkのバックエンドの実装
  def fetch_link
    @og = Editor::OpenGraph.new(params[:url])
  end
end
