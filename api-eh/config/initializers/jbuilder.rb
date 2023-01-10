# frozen_string_literal: true

require 'jbuilder/jbuilder_template'

# JSON keyを　camel caseにして返す
# https://github.com/rails/jbuilder#formatting-keys
Jbuilder.key_format camelize: :lower
Jbuilder.deep_format_keys true

ActiveSupport.on_load :action_view do
  ActionView::Template.register_template_handler :jbuilder, JbuilderHandler
  require 'jbuilder/dependency_tracker'
end
