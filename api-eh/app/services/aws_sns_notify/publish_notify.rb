# frozen_string_literal: true

class AwsSnsNotify::PublishNotify
  # @param [Hash] message
  # @param [Aws::SNS::Client] client
  # client = Mock::SnsClient.new OR Aws::SNS::Client.new(region: 'ap-northeast-1')
  def initialize(message:, client:)
    @message = message
    @client ||= client
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

  def topic_arn
    ENV['SNS_TOPIC_UPDATE_ARN']
  end
end
