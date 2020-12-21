# frozen_string_literal: true

# For methods, refer to the properties of the CloudFormation CodeBuild::Project https://amzn.to/2UTeNlr
# For convenience methods, refer to the source https://github.com/tongueroo/cody/blob/master/lib/cody/dsl/project.rb

# name("example-project-name") # recommend leaving unset and codebuild will use a conventional name
github_url('https://github.com/d7lab/aw-editorialhands-ui.git')
linux_image('aws/codebuild/amazonlinux2-x86_64-standard:3.0')
vpc_config @vpc_config
environment_variables(
  AWS_DEFAULT_REGION: 'ap-northeast-1',
  IMAGE_REPO_NAME: 'aw-editorialhands',
  IMAGE_TAG: 'latest',
  AWS_ACCOUNT_ID: 'ssm:/aw-editorialhands/aws-account-id'
)

# Some useful helpers:
# puts "project_name #{project_name}" # IE: demo-web
# puts "full_project_name #{full_project_name}" # demo-web-development

# Uncomment to enable github webhook, the GitHub oauth token needs admin:repo_hook permissions
# Refer to https://cody.run/docs/github_oauth/
# triggers(webhook: true)
# Another example:
# Docs: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html
# {type: "EVENT", pattern: "PUSH"} is required
# Also, note the extra brackets: [[]] is actually the proper format. I know weird.
# triggers(
#   webhook: true,
#   filter_groups: [[{type: "HEAD_REF", pattern: "my-branch"}, {type: "EVENT", pattern: "PUSH"}]]
# )

# Shorthand to enable all local cache modes
# local_cache(true)
