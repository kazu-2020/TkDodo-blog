# frozen_string_literal: true

class HealthcheckController < ApiBaseController
  def show
    # NOTE: albからのhealthcheck時のみ通すような制御したい
    ActiveRecord::Base.connection.select_one('select now()')
    head :ok
  end
end
