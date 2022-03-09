# frozen_string_literal: true

# For methods, refer to the properties of the CloudFormation CodeBuild::Project https://amzn.to/2UTeNlr
# For convenience methods, refer to the source https://github.com/tongueroo/cody/blob/master/lib/cody/dsl/project.rb

github_url('https://github.com/d7lab/aw-editorialhands.git')
linux_image(@target_linux_image)
environment_variables(@env_values)

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
