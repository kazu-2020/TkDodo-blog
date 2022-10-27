# frozen_string_literal: true

json.success @og.error.empty? ? true : false
json.error @og.error
json.meta({})
