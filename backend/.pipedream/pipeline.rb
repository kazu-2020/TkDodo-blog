# frozen_string_literal: true

stage 'Source' do
  github(
    source: 'd7lab/aw-editorialhands-ui',
    # branch: "master", # branch defaults to "master" or the `pipe deploy --branch` option
    auth_token: ssm('/aw-editorialhands/codepipeline/github/token') # example ssm name
  )
end

# IMPORANT: A valid pipeline requires at least 2 stages befre you are able to run
#
#     pipe deploy
#
# Here are some possible examples below. If you need help creating a CodeBuild project one, check out
# https://pipedream.run/docs/examples/codebuild-project/

stage 'Build' do
  codebuild(name: 'aw-editorialhands-docker-build', project_name: 'aw-editorialhands-docker-build')
end

# stage 'Approve' do
#   # Existing SNS Topic
#   approve(
#     notification_arn: 'arn:aws:sns:ap-northeast-1:360128825233:CodeStarNotifications-aw-editorialhands-notify-6fe89c5444dacf7de96471878536e35abab15c6d',
#     custom_data: 'Approve deployment'
#   )
# end

stage 'Deploy' do
  codebuild(name: 'aw-editorialhands-deploy', project_name: 'aw-editorialhands-deploy')
end
