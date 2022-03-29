# frozen_string_literal: true

class PromoteImageJob < SidekiqBaseJob
  sidekiq_options queue: 'p7'

  def perform(attacher_class, record_class, record_id, name, file_data)
    super
    attacher_class = Object.const_get(attacher_class)
    record = Object.const_get(record_class).find(record_id) # if using Active Record

    attacher = attacher_class.retrieve(model: record, name: name, file: file_data)
    attacher.create_derivatives # call derivatives processor
    attacher.atomic_promote
  rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
    # attachment has changed or record has been deleted, nothing to do
  end
end
