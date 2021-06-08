# frozen_string_literal: true

require 'shrine'

environment_name =
  if ENV['JETS_ENV'].present?
    Jets.env
  else
    Rails.env
  end

if ENV['USE_S3_SHRINE'] || environment_name == 'production'
  require 'shrine/storage/s3'

  s3_options = {
    region: 'ap-northeast-1',
    bucket: 'tomigaya-dev-aw-editorialhands-resources'
  }

  cache_storage = Shrine::Storage::S3.new(prefix: "shrine/#{environment_name}/assets/cache", **s3_options)
  store_storage = Shrine::Storage::S3.new(prefix: "shrine/#{environment_name}/assets/images", **s3_options)
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

Shrine.plugin :activerecord           # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :derivatives            # allows storing processed files ("derivatives") alongside the main attached file
Shrine.plugin :determine_mime_type    # mime typeを判定してくれるプラグイン
Shrine.plugin :remote_url, max_size: 20 * 1024 * 1024
Shrine.plugin :restore_cached_data    # extracts metadata for assigned cached files
Shrine.plugin :validation
