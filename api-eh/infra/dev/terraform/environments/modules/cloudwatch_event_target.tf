resource "aws_cloudwatch_event_rule" "playlist_recalculate_playlist_item_duration" {
  name                  = "playlist_recalculate_playlist_item_duration"
  description           = "プレイリスト再生時間の再計算"
  schedule_expression   = "cron(0 19 * * ? *)"
}

resource "aws_cloudwatch_event_target" "playlist_recalculate_playlist_item_duration" {
  target_id      = "playlist_recalculate_playlist_item_duration"
  arn            = aws_ecs_cluster.ecs_cluster.arn
  rule           = aws_cloudwatch_event_rule.playlist_recalculate_playlist_item_duration.name
  role_arn       = aws_iam_role.iam_role_event.arn
  input          = file("${path.module}/cloudwatch_event_targets/playlist_recalculate_playlist_item_duration.json")

  ecs_target {
    launch_type               = "FARGATE"
    task_count                = 1
    task_definition_arn       = "arn:aws:ecs:ap-northeast-1:${var.aws_account_id}:task-definition/${local.env_resource_prefix}"
    platform_version          = "1.4.0"
    network_configuration {
      subnets = [
        "${lookup(var.subnet_private_a, "${terraform.workspace}")}",
        "${lookup(var.subnet_private_c, "${terraform.workspace}")}",
      ]
      security_groups = [
        "${lookup(var.app_security_group, "${terraform.workspace}")}",
      ]
      assign_public_ip = true
    }
  }
}

resource "aws_cloudwatch_event_rule" "playlist_items_change_status_of_zombified_and_respawned_episodes" {
  name                  = "playlist_items_change_status_of_zombified_and_respawned_episodes"
  description           = "プレイリスト内エピソードの仮死状態の変更"
  schedule_expression   = "cron(0 19 * * ? *)"
}

resource "aws_cloudwatch_event_target" "playlist_items_change_status_of_zombified_and_respawned_episodes" {
  target_id      = "playlist_items_change_status_of_zombified_and_respawned_episodes"
  arn            = aws_ecs_cluster.ecs_cluster.arn
  rule           = aws_cloudwatch_event_rule.playlist_items_change_status_of_zombified_and_respawned_episodes.name
  role_arn       = aws_iam_role.iam_role_event.arn
  input          = file("${path.module}/cloudwatch_event_targets/playlist_items_change_status_of_zombified_and_respawned_episodes.json")

  ecs_target {
    launch_type               = "FARGATE"
    task_count                = 1
    task_definition_arn       = "arn:aws:ecs:ap-northeast-1:${var.aws_account_id}:task-definition/${local.env_resource_prefix}"
    platform_version          = "1.4.0"
    network_configuration {
      subnets = [
        "${lookup(var.subnet_private_a, "${terraform.workspace}")}",
        "${lookup(var.subnet_private_c, "${terraform.workspace}")}",
      ]
      security_groups = [
        "${lookup(var.app_security_group, "${terraform.workspace}")}",
      ]
      assign_public_ip = true
    }
  }
}

resource "aws_cloudwatch_event_rule" "playlists_import_r5_playlists" {
  name                  = "playlists_import_r5_playlists"
  description           = "r5プレイリストの同期"
  schedule_expression   = "rate(3 hours)"
}

resource "aws_cloudwatch_event_target" "playlists_import_r5_playlists" {
  target_id      = "playlists_import_r5_playlists"
  arn            = aws_ecs_cluster.ecs_cluster.arn
  rule           = aws_cloudwatch_event_rule.playlists_import_r5_playlists.name
  role_arn       = aws_iam_role.iam_role_event.arn
  input          = file("${path.module}/cloudwatch_event_targets/playlists_import_r5_playlists.json")

  ecs_target {
    launch_type               = "FARGATE"
    task_count                = 1
    task_definition_arn       = "arn:aws:ecs:ap-northeast-1:${var.aws_account_id}:task-definition/${local.env_resource_prefix}"
    platform_version          = "1.4.0"
    network_configuration {
      subnets = [
        "${lookup(var.subnet_private_a, "${terraform.workspace}")}",
        "${lookup(var.subnet_private_c, "${terraform.workspace}")}",
      ]
      security_groups = [
        "${lookup(var.app_security_group, "${terraform.workspace}")}",
      ]
      assign_public_ip = true
    }
  }
}

resource "aws_cloudwatch_event_rule" "playlists_update_subtypes" {
  name                  = "playlists_update_subtypes"
  description           = "プレイリストのサブタイプ数を更新"
  schedule_expression   = "rate(3 hours)"
}

resource "aws_cloudwatch_event_target" "playlists_update_subtypes" {
  target_id      = "playlists_update_subtypes"
  arn            = aws_ecs_cluster.ecs_cluster.arn
  rule           = aws_cloudwatch_event_rule.playlists_update_subtypes.name
  role_arn       = aws_iam_role.iam_role_event.arn
  input          = file("${path.module}/cloudwatch_event_targets/playlists_update_subtypes.json")

  ecs_target {
    launch_type               = "FARGATE"
    task_count                = 1
    task_definition_arn       = "arn:aws:ecs:ap-northeast-1:${var.aws_account_id}:task-definition/${local.env_resource_prefix}"
    platform_version          = "1.4.0"
    network_configuration {
      subnets = [
        "${lookup(var.subnet_private_a, "${terraform.workspace}")}",
        "${lookup(var.subnet_private_c, "${terraform.workspace}")}",
      ]
      security_groups = [
        "${lookup(var.app_security_group, "${terraform.workspace}")}",
      ]
      assign_public_ip = true
    }
  }
}
