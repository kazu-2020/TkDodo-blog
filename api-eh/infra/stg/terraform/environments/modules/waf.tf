# albに直接アクセスされるのを防ぐために
# albにwafの制御で特定のヘッダがあるときのみアクセス許可するように制御する
resource "aws_wafregional_regex_match_set" "block_regexp_match" {
  name = "${local.env_resource_prefix}-block-regexp-match"

  regex_match_tuple {
    field_to_match {
      data = "x-pre-shared-key"
      type = "HEADER"
    }

    regex_pattern_set_id = aws_wafregional_regex_pattern_set.block_regexp_pattern.id
    text_transformation  = "NONE"
  }
}

resource "aws_wafregional_ipset" "allow_ipset" {
  name = "${local.env_resource_prefix}-allowed-ipset"

  // kodera-san
  ip_set_descriptor {
    type  = "IPV4"
    value = "182.171.239.19/32"
  }
}

resource "aws_wafregional_regex_pattern_set" "block_regexp_pattern" {
  name = "${local.env_resource_prefix}-block-regexp-pattern"

  regex_pattern_strings = [
    "^${lookup(var.cf_alb_pre_shared_key.value, "${terraform.workspace}.id")}$",
  ]
}

resource "aws_wafregional_rule" "alb_rule" {
  name        = "${local.env_resource_prefix}-alb-rule"
  metric_name = "${replace(var.name, "-", "")}${terraform.workspace}albacl"

  predicate {
    data_id = aws_wafregional_regex_match_set.block_regexp_match.id
    negated = false
    type    = "RegexMatch"
  }
}

resource "aws_wafregional_rule" "alb_ip_rule" {
  name        = "${local.env_resource_prefix}-alb-ip-rule"
  metric_name = "${replace(var.name, "-", "")}${terraform.workspace}albacl"
  depends_on  = [aws_wafregional_ipset.allow_ipset]

  predicate {
    data_id = aws_wafregional_ipset.allow_ipset.id
    negated = false
    type    = "IPMatch"
  }
}


resource "aws_wafregional_web_acl" "alb_acl" {
  name        = "${local.env_resource_prefix}-alb-acl"
  metric_name = "${replace(var.name, "-", "")}${terraform.workspace}albacl"

  default_action {
    type = "BLOCK"
  }

  rule {
    action {
      type = "ALLOW"
    }

    priority = 1
    rule_id  = aws_wafregional_rule.alb_ip_rule.id
  }
  rule {
    action {
      type = "ALLOW"
    }

    priority = 2
    rule_id  = aws_wafregional_rule.alb_rule.id
  }
}

resource "aws_wafregional_web_acl_association" "acl_assoc" {
  resource_arn = aws_alb.alb.arn
  web_acl_id   = aws_wafregional_web_acl.alb_acl.id
}
