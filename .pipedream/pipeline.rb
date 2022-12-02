# frozen_string_literal: true

pipe_env = ENV['PIPE_ENV'] || 'dev'
target_branch = ENV['PIPELINE_TARGET_BRANCH'] || 'develop'

stage 'Source' do
  github(
    source_name: 'Source',
    source: 'd7lab/aw-editorialhands',
    branch: target_branch, # branch defaults to 'master' or the `pipe deploy --branch` option
    auth_token: ssm('/editorialhands/codepipeline/github/token')
  )
end

stage 'Build-and-Deploy' do
  builds = []
  builds << { name: "api-eh-#{pipe_env}", project_name: "api-eh-#{pipe_env}", input_artifacts: [name: "SourceArtifact"] }
  builds << { name: "editorialhands-frontend-#{pipe_env}", project_name: "editorialhands-frontend-#{pipe_env}", input_artifacts: [name: "SourceArtifact"] }

  codebuild(*builds)
end
