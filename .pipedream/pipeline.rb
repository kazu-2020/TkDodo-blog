# frozen_string_literal: true

pipe_env = ENV['PIPE_ENV'] || 'development'
target_branch = ENV['PIPELINE_TARGET_BRANCH'] || 'develop'

stage 'Source' do
  github(
    source: 'd7lab/aw-editorialhands',
    branch: target_branch, # branch defaults to 'master' or the `pipe deploy --branch` option
    auth_token: ssm('/aw-editorialhands/codepipeline/github/token')
  )
end

stage 'API-Build-and-Deploy' do
  codebuild(name: "api-eh-#{pipe_env}", project_name: "api-eh-#{pipe_env}")
end

unless target_branch == 'develop'
  stage 'Frontend-Deploy-to-Staging' do
    codebuild(name: "editorialhands-frontend-#{pipe_env}", project_name: "editorialhands-frontend-#{pipe_env}")
  end
end
