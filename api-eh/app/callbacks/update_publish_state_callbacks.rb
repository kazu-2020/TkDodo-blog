class UpdatePublishStateCallbacks
  def after_commit(record)
    refresh_image_storage(record)
  end

  private

  def refresh_image_storage(record)
    if record.instance_of?(Playlist)
      record.refresh_image_storage if record.respond_to?(:refresh_image_storage)
    else
      record.refresh_image_storage(attacher: record.image_attacher) if record.respond_to?(:refresh_image_storage)
    end
  end
end
