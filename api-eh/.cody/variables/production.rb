# frozen_string_literal: true

@target_linux_image = '312328096018.dkr.ecr.ap-northeast-1.amazonaws.com/editorialhands-deployer:v6'
@env_values = {
  DOCKERHUB_USER: 'ssm:/editorialhands/production/dockerhub_user',
  DOCKERHUB_PASS: 'ssm:/editorialhands/production/dockerhub_pass',
  AWS_DEFAULT_REGION: 'ap-northeast-1',
  SLACK_NOTIFICATION_URL: 'https://hooks.slack.com/services/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',
  TARGET_BRANCH: 'master',
  RAILS_MASTER_KEY_PRODUCTION: 'ssm:/editorialhands/production/rails_master_key'
}
