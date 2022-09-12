# frozen_string_literal: true

class SnsNotify::Playlist
  # @param [Array] playlist_ids
  def send(playlist_ids)
    SnsNotify::Client.new(build_message(playlist_ids)).call
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
