# frozen_string_literal: true

module StoredImageHelpers
  # @param [Shrine::Attacher] attacher
  def exists_public_store?(attacher)
    File.exist?(Rails.root.join('public', 'uploads', 'test', 'public') + attacher.file.id)
  end

  def exists_private_store?(attacher)
    File.exist?(Rails.root.join('public', 'uploads', 'test', 'private') + attacher.file.id)
  end

  def exists_draft_store?(attacher)
    File.exist?(Rails.root.join('public', 'uploads', 'test', 'draft') + attacher.file.id)
  end

  def exists_draft_cache?(attacher)
    File.exist?(Rails.root.join('public', 'uploads', 'test', 'draft', 'cache') + attacher.file.id)
  end
end
