# frozen_string_literal: true

module Mock
  class SnsClient
    def publish(topic_arn:, message:)
      puts <<-MESSAGE.strip_heredoc
      topic_arn:
        #{topic_arn}
      message:
        #{message}
      MESSAGE
    end
  end
end
