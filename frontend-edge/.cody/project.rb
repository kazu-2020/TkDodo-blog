# For methods, refer to the properties of the CloudFormation CodeBuild::Project https://amzn.to/2UTeNlr
# For convenience methods, refer to the source https://github.com/tongueroo/cody/blob/master/lib/cody/dsl/project.rb
# Docs:
#
# * https://cody.run/docs/dsl/project/
# * https://cody.run/docs/docs/dsl/helpers/
#

name("editorialhands-frontend-#{@env_values[:ENVIRONMENT]}")
github_url('https://github.com/d7lab/aw-editorialhands.git')
linux_image("aws/codebuild/amazonlinux2-x86_64-standard:4.0")
environment_variables(@env_values)
