# frozen_string_literal: true

require 'shrine'

environment_name = Rails.env
is_tomigaya_env = ![nil, 'development', 'test'].include?(environment_name)

if ENV['USE_S3_SHRINE'] || is_tomigaya_env
  require 'shrine/storage/s3'

  base_bucket =
    if Rails.env.development? || Rails.env.dev?
      'tomigaya-dev-editorialhands-images'
    elsif Rails.env.staging?
      'tomigaya-stg-editorialhands-images'
    elsif Rails.env.production?
      'tomigaya-prd-editorialhands-images'
    else
      raise '設定して下さい'
    end

  s3_options = {
    region: 'ap-northeast-1',
    bucket: base_bucket
  }

  private_s3_options = if Rails.env.dev?
                         s3_options.merge(bucket: 'tomigaya-dev-editorialhands-resources')
                       elsif Rails.env.staging?
                         s3_options.merge(bucket: 'tomigaya-stg-editorialhands-resources')
                       elsif Rails.env.production?
                         s3_options.merge(bucket: 'tomigaya-prd-editorialhands-resources')
                       else
                         raise '設定して下さい'
                       end

  public_store = Shrine::Storage::S3.new(prefix: 'static/assets/images', **s3_options)
  private_store = Shrine::Storage::S3.new(prefix: 'static/assets/images', **private_s3_options)
  private_cache = Shrine::Storage::S3.new(prefix: 'static/assets/cache', **private_s3_options)
else
  require 'shrine/storage/file_system'

  prefix = environment_name == 'test' ? 'uploads/test' : 'uploads'
  public_store = Shrine::Storage::FileSystem.new('public', prefix: "#{prefix}/public")
  private_store = Shrine::Storage::FileSystem.new('public', prefix: "#{prefix}/private")
  private_cache = Shrine::Storage::FileSystem.new('public', prefix: "#{prefix}/private/cache")
end

Shrine.storages = {
  cache: private_cache,       # temporary
  store: private_store,       # permanent
  public_store: public_store  # 公開バケット
}

Shrine.plugin :activerecord # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :derivatives # allows storing processed files ("derivatives") alongside the main attached file
Shrine.plugin :determine_mime_type, analyzer: :marcel # mime typeを判定してくれるプラグイン
Shrine.plugin :remote_url, max_size: 20 * 1024 * 1024
Shrine.plugin :restore_cached_data # extracts metadata for assigned cached files
Shrine.plugin :validation
module KeepFilesWithDeleteOption
  module AttacherMethods
    def destroy?
      record.respond_to?(:remove_shrine_image?) && record.remove_shrine_image?
    end
  end
end
# Shrine.plugin KeepFilesWithDeleteOption # 更新履歴の実装の際に画像を削除しないようにするために必要

# background job
Shrine.plugin :backgrounding
Shrine::Attacher.promote_block do
  PromoteImageJob.perform_async(self.class.name, record.class.name, record.id, name, file_data)
end
Shrine::Attacher.destroy_block do
  DestroyImageJob.perform_async(self.class.name, data)
end

# https://shrinerb.com/docs/plugins/mirroring
Shrine.plugin :mirroring, mirror: { store: :public_store }, upload: false
Shrine.mirror_upload_block do |file, **_options|
  MirrorUploadImageJob.perform_async(file.shrine_class.name, file.data, file.id)
end

Shrine.mirror_delete_block do |file|
  MirrorDeleteImageJob.perform_async(file.shrine_class.name, file.data)
end
