# frozen_string_literal: true

class SnsNotify::Publish
  # @param [Hash] message
  def initialize(message)
    @message = message
    @client ||= sns_client
  end

  def call
    publish
  end

  private

  def publish
    @client.publish(
      topic_arn: topic_arn,
      message: @message.to_json
    )

    Logger.new(Rails.root.join('log', "#{Rails.env}.log")).debug <<-MESSAGE.strip_heredoc
      topic_arn:
        #{topic_arn}
      message:
        #{@message.to_json}
    MESSAGE
  end

  def sns_client
    return Mock::SnsClient.new if Rails.env.development? || Rails.env.test?

    Aws::SNS::Client.new(region: 'ap-northeast-1')
  end

  def topic_arn
    ENV.fetch('SNS_TOPIC_UPDATE_ARN', nil)
  end
end
