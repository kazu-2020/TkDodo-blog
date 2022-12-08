# frozen_string_literal: true

class MirrorUploadImageJob < SidekiqBaseJob
  sidekiq_options queue: 'p7'
  def perform(shrine_class, file_data, key)
    super
    return unless s3_private_store_file_exist?(key)

    shrine_class = Object.const_get(shrine_class)

    file = shrine_class.uploaded_file(file_data)
    file.mirror_upload
  end

  private

  # AWS S3 が用意されていない development 環境と test 環境ではスキップする
  # NOTE: テストデータ差し込みのためにメソッド化
  def skip_environment?
    Rails.env.development? || Rails.env.test?
  end

  def s3_private_store_file_exist?(key)
    return true if skip_environment?

    s3_file_path = s3_file_path(key)
    logger.debug "File path: #{s3_file_path}"

    s3_bucket.object(s3_file_path).exists?.tap do |exists|
      unless exists
        logger.warn "File does not exist in S3 private store of ​​path: #{s3_file_path}"
        notification_to_slack(s3_file_path)
      end
    end
  end

  def s3_file_path(key)
    "#{Shrine.storages[:store].prefix}/#{key}"
  end

  def s3_bucket
    Aws::S3::Resource.new(region: 'ap-northeast-1', credentials: aws_credentials).bucket(s3_private_store_bucket_name)
  end

  def s3_private_store_bucket_name
    if Rails.env.dev?
      'tomigaya-dev-editorialhands-resources'
    elsif Rails.env.staging?
      'tomigaya-stg-editorialhands-resources'
    elsif Rails.env.production?
      'tomigaya-prd-editorialhands-resources'
    elsif Rails.env.test?
      'dummy'
    else
      raise '設定して下さい'
    end
  end

  def aws_credentials
    if ENV['AWS_CONTAINER_CREDENTIALS_RELATIVE_URI']
      Rails.logger.info 'use ecs credentials'
      Aws::ECSCredentials.new
    else
      Rails.logger.info 'use instance profile credentials'
      Aws::InstanceProfileCredentials.new
    end
  end

  def notification_to_slack(s3_file_path)
    return if Rails.env.test? || !ENV.fetch('SLACK_WEBHOOK_URL', nil)&.include?('https://hooks.slack.com/')

    attachments = {
      fallback: 'File does not exist in S3 private store of ​​path',
      title: 'MirrorUploadImageJob',
      fields: [{ title: '環境', value: Rails.env },
               { title: 'File does not exist in S3 private store', value: s3_file_path }],
      color: 'warning',
      ts: Time.now.to_i
    }
    Slack::Notifier.new(ENV.fetch('SLACK_WEBHOOK_EXCEPTIONS_URL', nil)).post text: 'MirrorUploadImageJob',
                                                                             attachments: attachments
  end
end
