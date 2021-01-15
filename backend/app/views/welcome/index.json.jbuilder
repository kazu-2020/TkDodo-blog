# frozen_string_literal: true

messages = ['good morning', 'hello', 'good evening']

json.array! messages.each_with_index.to_a do |(message, i)|
  json.id i + 1
  json.body message
end
