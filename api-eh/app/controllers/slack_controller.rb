# frozen_string_literal: true

class SlackController < ApiBaseController
  SLACK_CHANNEL = 'lab-nhk-labo-app-notify'

  def incoming_webhook
    slack.channel = SLACK_CHANNEL
    slack.post params[:text] if ENV['SLACK_WEBHOOK_URL'].present?
    render json: { message: 'ok' }, status: 200
  end

  private

  def slack
    @slack ||= Slack::Incoming::Webhooks.new ENV['SLACK_WEBHOOK_URL']
  end
end
