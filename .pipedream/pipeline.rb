# frozen_string_literal: true

pipe_env = ENV['PIPE_ENV'] || 'development'
target_branch = ENV['PIPELINE_TARGET_BRANCH'] || 'develop'

stage 'Source' do
  github(
    source: 'd7lab/aw-editorialhands',
    branch: target_branch, # branch defaults to 'master' or the `pipe deploy --branch` option
    auth_token: ssm('/editorialhands/codepipeline/github/token')
  )
end

stage 'API-Build-and-Deploy' do
  codebuild(name: "api-eh-#{pipe_env}", project_name: "api-eh-#{pipe_env}")
  codebuild(name: "editorialhands-frontend-#{pipe_env}", project_name: "editorialhands-frontend-#{pipe_env}") unless target_branch == 'develop'
end
