# frozen_string_literal: true

json.success @og.error.empty?
json.error @og.error
json.meta({})
