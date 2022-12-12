class UpdatePublishStateCallbacks
  def after_commit(record)
    # recordがPlaylistかつapi_stateが変更されていない場合return
    return if record.instance_of?(Playlist) && !record.api_state_previously_changed?

    refresh_image_storage(record)
  end

  private

  def refresh_image_storage(record)
    record.refresh_image_storage if record.respond_to?(:refresh_image_storage)
  end
end
