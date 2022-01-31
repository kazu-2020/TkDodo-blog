# frozen_string_literal: true

# FIXME: CMS1からざっくり移植、日時予約系の処理は設計し直す
module ApiStatable
  extend ActiveSupport::Concern

  COLLECT_INTERVAL_MIN = 10 # バッチの実行間隔(分)

  # 公開ステータス変更ジョブに即時登録するかどうかのリミット時間
  # 公開開始、終了時間が27時までなら即時登録、それを越えると日時バッチで登録を行う
  UPDATE_PUBLISH_STATE_LIMIT_HOUR = 3.hours

  included do
    # 公開ステータス
    # 0: 非公開
    # 1: 公開中
    # 2: 公開待ち
    enum api_state: { close: 0, open: 1, waiting: 2 }, _prefix: true

    with_options on: :publications do
      validates :open_scheduled_at, after_collect_time: { time: COLLECT_INTERVAL_MIN }
      validates :close_scheduled_at, after_collect_time: { time: COLLECT_INTERVAL_MIN }
      validate :presence_open_scheduled_at
    end
  end

  def presence_open_scheduled_at
    errors.add(:open_scheduled_at, 'はapi_stateがwaitingの場合、必須です') if api_state_waiting? && open_scheduled_at.blank?
  end

  def update_publish_state(attributes)
    assign_attributes(attributes.slice(:api_state, :open_scheduled_at, :close_scheduled_at))
    clear_unnecessary_scheduled_at
    if valid?(:publications)
      save
      true
    else
      false
    end
  end

  # publish_stateを更新し、公開状態の更新ジョブを登録する
  def update_publish_and_register_job(attributes)
    result = update_publish_state(attributes)
    update_scheduled_publish_job if result
    result
  end

  # 公開ステータス変更ジョブを登録する
  def register_publish_job!(state:)
    scheduled_at = state == :publish ? open_scheduled_at : close_scheduled_at
    UpdatePublishStateJob.perform_at(scheduled_at, scheduled_at, self.class.to_s, id, state.to_s)
  end

  private

  # 公開ステータスごとに不要な open_scheduled_at, close_scheduled_at を空にする
  def clear_unnecessary_scheduled_at
    if api_state_close?
      self.open_scheduled_at = nil
      self.close_scheduled_at = nil
    elsif api_state_open?
      self.open_scheduled_at = nil
    end
  end

  # 公開ステータス変更ジョブの登録、削除を行う
  def update_scheduled_publish_job
    return if nop_condition?

    register_publish_job!(state: :publish) if ready_to_publish?
    register_publish_job!(state: :unpublish) if ready_to_unpublish?
  end

  def nop_condition?
    return true if discarded?
    return true if api_state_waiting? && open_scheduled_at_is_after_today?
    return true if api_state_open? && close_scheduled_at_is_after_today?

    false
  end

  # 「公開予約」への変更条件を満たしているか
  def ready_to_publish?
    api_state_waiting? && open_scheduled_at
  end

  # 「公開」への変更条件を満たしているか
  def ready_to_unpublish?
    (api_state_open? && close_scheduled_at) || (api_state_waiting? && close_scheduled_at)
  end

  # 公開開始日時が27時以降か
  def open_scheduled_at_is_after_today?
    !open_scheduled_at || open_scheduled_at >= register_job_time_limit
  end

  # 公開終了日時が27時以降か
  def close_scheduled_at_is_after_today?
    !close_scheduled_at || close_scheduled_at >= register_job_time_limit
  end

  # ジョブ即時登録のタイムリミット
  def register_job_time_limit
    Time.current.ago(UPDATE_PUBLISH_STATE_LIMIT_HOUR).tomorrow.beginning_of_day.since(UPDATE_PUBLISH_STATE_LIMIT_HOUR)
  end
end
