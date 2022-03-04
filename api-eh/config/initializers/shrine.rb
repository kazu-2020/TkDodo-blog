# frozen_string_literal: true

require 'shrine'

environment_name = Rails.env
is_tomigaya_env = ![nil, 'development', 'test'].include?(environment_name)

if ENV['USE_S3_SHRINE'] || is_tomigaya_env
  require 'shrine/storage/s3'

  s3_options = {
    region: 'ap-northeast-1',
    bucket: 'tomigaya-dev-aw-editorialhands-resources'
  }

  cache_storage = Shrine::Storage::S3.new(prefix: 'static/assets/cache', **s3_options)
  store_storage = Shrine::Storage::S3.new(prefix: 'static/assets/images', **s3_options)
else
  require 'shrine/storage/file_system'

  prefix = environment_name == 'test' ? 'uploads/test' : 'uploads'
  cache_storage = Shrine::Storage::FileSystem.new('public', prefix: "#{prefix}/cache")
  store_storage = Shrine::Storage::FileSystem.new('public', prefix: prefix)
end

Shrine.storages = {
  cache: cache_storage, # temporary
  store: store_storage # permanent
}

module KeepFilesWithDeleteOption
  module AttacherMethods
    def destroy?
      record.respond_to?(:remove_shrine_image?) && record.remove_shrine_image?
    end
  end
end

Shrine.plugin :activerecord           # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :derivatives            # allows storing processed files ("derivatives") alongside the main attached file
Shrine.plugin :determine_mime_type    # mime typeを判定してくれるプラグイン
Shrine.plugin :remote_url, max_size: 20 * 1024 * 1024
Shrine.plugin :restore_cached_data    # extracts metadata for assigned cached files
Shrine.plugin :validation
Shrine.plugin KeepFilesWithDeleteOption
