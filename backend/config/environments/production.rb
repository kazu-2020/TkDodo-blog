# frozen_string_literal: true

Jets.application.configure do
  # Example:
  # config.function.memory_size = 2048

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # Docs: http://rubyonjets.com/docs/email-sending/
  # config.action_mailer.raise_delivery_errors = false
  config.function.vpc_config = {
    security_group_ids: %w[sg-0aeb9fe5497f55bce], # tomigaya-dev-internal-sg
    subnet_ids: [
      'subnet-0c0798cf0dedcb52b', # tomigaya-dev-nat-a
      'subnet-0134f297a6631ae21', # tomigaya-dev-nat-c
      'subnet-0494f14a1e59651d2' # tomigaya-dev-nat-d
    ]
  }

  config.shrine_config = {
    default_url: 'https://d1zefghvqpvnvt.cloudfront.net'
  }
end
