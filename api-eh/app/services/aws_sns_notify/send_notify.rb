# frozen_string_literal: true

class AwsSnsNotify::SendNotify
  # @param [Array] playlist_ids
  # @param [Aws::SNS::Client] client
  def call(playlist_ids:, client:)
    AwsSnsNotify::PublishNotify.new(message: build_message(playlist_ids), client: client).call
  end

  private

  # @see https://github.com/d7lab/dot-editorialhands/issues/49
  # {
  #   "message": "[EH] Update Notification",
  #   "body": [
  #     {
  #       "messageType": "Updated or Created or Deleted",
  #       "PlaylistIDs": [
  #         "eh-xxxxxxxxx",
  #         "eh-xxxxxxxxx",
  #         "eh-xxxxxxxxx"
  #       ]
  #     }
  #   ]
  # }
  # @param [Array] playlist_ids
  def build_message(playlist_ids)
    {
      message: '[EH] Update Notification',
      body: [
        {
          messageType: 'Updated',
          PlaylistIDs: playlist_ids
        }
      ]
    }
  end
end
