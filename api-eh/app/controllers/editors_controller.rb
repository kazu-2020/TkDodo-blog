# frozen_string_literal: true

class EditorsController < ApiBaseController
  # @editorjs/linkのバックエンドの実装
  def fetch_link
    @og = Editor::OpenGraph.new(params[:url])
  end
end
