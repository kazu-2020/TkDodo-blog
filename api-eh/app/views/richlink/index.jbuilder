# frozen_string_literal: true

json.title @title
json.description @description
json.image @image
json.time_ago_in_words "#{time_ago_in_words(@date)}前" if @date.present?
