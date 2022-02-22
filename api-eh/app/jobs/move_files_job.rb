# https://github.com/shrinerb/shrine/blob/master/doc/changing_location.md#2-move-existing-files
class MoveFilesJob
  include Sidekiq::Worker

  def perform(attacher_class, record_class, record_id, name, file_data)
    attacher_class = Object.const_get(attacher_class)
    record = Object.const_get(record_class).find(record_id) # if using Active Record

    attacher = attacher_class.retrieve(model: record, name: name, file: file_data)
    old_attacher = attacher.dup
    current_file = old_attacher.file

    attacher.set attacher.upload(attacher.file)
    attacher.set_derivatives attacher.upload_derivatives(attacher.derivatives)

    attacher.atomic_persist(current_file)
    old_attacher.destroy_attached
  rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
    attacher&.destroy_attached
  end
end
