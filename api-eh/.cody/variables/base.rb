# frozen_string_literal: true

@target_linux_image = '359601428599.dkr.ecr.ap-northeast-1.amazonaws.com/aw-editorialhands-deployer:v5'
@env_values = {
  AWS_DEFAULT_REGION: 'ap-northeast-1',
  SLACK_NOTIFICATION_URL: 'https://hooks.slack.com/services/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',
  TARGET_BRANCH: 'master'
}
@vpc_config = {
  VpcId: 'vpc-04ce451b32004288d', # tomigaya-dev-vpc
  Subnets: [
    'subnet-0c0798cf0dedcb52b', # tomigaya-dev-nat-a
    'subnet-0134f297a6631ae21', # tomigaya-dev-nat-c
    'subnet-0494f14a1e59651d2' # tomigaya-dev-nat-d
  ],
  SecurityGroupIds: [
    'sg-0aeb9fe5497f55bce' # tomigaya-dev-internal-sg
  ]
}
