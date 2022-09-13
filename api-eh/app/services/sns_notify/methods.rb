# Interface相当のModuleです
# 新しいメソッドを追加する場合は、このファイルに追加してください

module SnsNotify::Methods
  # @param [Array] ids
  def publish(ids)
    raise NotImplementedError, "#{self.class}##{__method__}を実装してください"
  end
end
