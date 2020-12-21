# frozen_string_literal: true

Jets.application.configure do
  # Example:
  # config.function.memory_size = 1536

  # config.action_mailer.raise_delivery_errors = false
  # Docs: http://rubyonjets.com/docs/email-sending/
  config.function.vpc_config = {
    security_group_ids: %w[sg-0aeb9fe5497f55bce], # tomigaya-dev-internal-sg
    subnet_ids: [
      'subnet-0c0798cf0dedcb52b', # tomigaya-dev-nat-a
      'subnet-0134f297a6631ae21', # tomigaya-dev-nat-c
      'subnet-0494f14a1e59651d2' # tomigaya-dev-nat-d
    ]
  }

  config.assets.folders = %w[assets images uploads]

  default_url =
    if ENV['USE_S3_SHRINE']
      'https://d1zefghvqpvnvt.cloudfront.net'
    else
      'http://localhost:8888'
    end
  config.shrine_config = { default_url: default_url }
end
