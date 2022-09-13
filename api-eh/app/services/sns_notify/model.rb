module SnsNotify::Model
  # @param [Array] ids
  def publish(ids)
    raise NotImplementedError, "#{self.class}##{__method__}を実装してください"
  end
end
