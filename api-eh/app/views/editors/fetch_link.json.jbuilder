# frozen_string_literal: true

json.success @og.error.empty? ? 1 : 0
json.error @og.error
json.meta({})
