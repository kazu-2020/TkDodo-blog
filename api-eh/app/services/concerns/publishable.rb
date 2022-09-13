# frozen_string_literal: true

# Interface相当のModuleです
module Publishable
  extend ActiveSupport::Concern

  # @param [Array] ids
  def publish(ids)
    raise NotImplementedError, "#{self.class}##{__method__}を実装してください"
  end
end
