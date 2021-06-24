# frozen_string_literal: true

pipe_env = ENV['PIPE_ENV'] || 'development'
target_branch = ENV['PIPELINE_TARGET_BRANCH'] || 'master'

stage 'Source' do
  github(
    source: 'd7lab/aw-editorialhands',
    branch: target_branch, # branch defaults to 'master' or the `pipe deploy --branch` option
    auth_token: ssm('/aw-editorialhands/codepipeline/github/token')
  )
end

stage 'Build-and-Deploy' do
  codebuild(name: "api-eh-#{pipe_env}", project_name: "api-eh-#{pipe_env}")
end
