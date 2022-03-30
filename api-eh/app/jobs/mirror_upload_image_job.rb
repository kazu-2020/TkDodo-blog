# frozen_string_literal: true

class MirrorUploadImageJob < SidekiqBaseJob
  sidekiq_options queue: 'p7'

  def perform(shrine_class, file_data)
    super
    shrine_class = Object.const_get(shrine_class)

    file = shrine_class.uploaded_file(file_data)
    file.mirror_upload
  end
end
