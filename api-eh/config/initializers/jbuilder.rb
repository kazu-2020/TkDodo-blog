# frozen_string_literal: true

require 'jbuilder/jbuilder_template'

ActiveSupport.on_load :action_view do
  ActionView::Template.register_template_handler :jbuilder, JbuilderHandler
  require 'jbuilder/dependency_tracker'
end
