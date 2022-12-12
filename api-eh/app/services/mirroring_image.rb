# frozen_string_literal: true

class MirroringImage
  class << self
    # @param [Shrine::Attacher] attacher
    def upload(attacher:, background: true)
      process(:upload, attacher, background)
    end

    # @param [Shrine::Attacher] attacher
    def delete(attacher:, background: true)
      process(:delete, attacher, background)
    end

    private

    def process(upload_or_delete, attacher, background)
      return if !attacher.attached? || temporary_storage?(attacher)

      mirroring_method = background ? "mirror_#{upload_or_delete}_background" : "mirror_#{upload_or_delete}"
      attacher.file&.send(mirroring_method)
      attacher.map_derivative(attacher.derivatives) { |_, derivative| derivative.send(mirroring_method) }
    end

    def temporary_storage?(attacher)
      !attacher&.file&.storage_key&.to_s&.end_with?('store')
    end
  end
end
