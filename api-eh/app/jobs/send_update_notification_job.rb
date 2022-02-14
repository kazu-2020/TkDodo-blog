# frozen_string_literal: true

class SendUpdateNotificationJob < SidekiqBaseJob
  sidekiq_options queue: 'p6'

  def perform
    super
    # FIXME: 暫定で1時間おきに全プレイリストの更新通知を飛ばしている
    ids_size = 5000 # 256kbの制限があるので、とりあえず5k件ずつ送信する
    Playlist.in_batches(of: ids_size) do |relation|
      playlist_ids = relation.pluck(:string_id)&.select { |id| id.present? }
      SnsNotify::Client.new(build_message(playlist_ids)).call if playlist_ids.present?
    end
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
