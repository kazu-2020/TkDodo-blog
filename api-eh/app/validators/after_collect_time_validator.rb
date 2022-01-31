# frozen_string_literal: true

class AfterCollectTimeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    return if value.in_time_zone > Time.current + options[:time].minutes

    record.errors.add attribute, (options[:message] || "は#{options[:time]}分以上先の日時にしてください")
  end
end
