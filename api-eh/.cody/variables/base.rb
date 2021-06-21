# frozen_string_literal: true

@target_linux_image = '359601428599.dkr.ecr.ap-northeast-1.amazonaws.com/aw-editorialhands-deployer:v1'
@env_values = {
  AWS_DEFAULT_REGION: 'ap-northeast-1',
  SLACK_NOTIFICATION_URL: 'https://hooks.slack.com/services/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',
  TARGET_BRANCH: 'master'
}
