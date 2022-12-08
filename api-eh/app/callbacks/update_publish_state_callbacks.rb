class UpdatePublishStateCallbacks
  def after_commit(record)
    # api_state が含まれない更新は無視する
    return unless record.api_state_previously_changed?

    refresh_image_storage(record)
  end

  private

  def refresh_image_storage(record)
    record.refresh_image_storage if record.respond_to?(:refresh_image_storage)
  end
end
