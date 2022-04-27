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
  // datadog iprange https://github.com/d7lab/dot-infra-ops/issues/115#issuecomment-1106272374
  ip_set_descriptor {
    type  = "IPV4"
    value = "107.21.25.247/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.114.211.96/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.115.46.213/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.126.169.175/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.209.118.42/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.209.230.111/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.234.54.8/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.236.246.161/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.238.14.57/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.244.188.203/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.244.85.86/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.245.200.254/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.48.150.244/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.48.239.118/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.48.254.37/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "13.54.169.48/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "15.188.202.64/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "15.188.240.172/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "15.188.243.248/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.130.113.168/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.139.52.173/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.195.155.52/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.200.120.237/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.229.28.50/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "18.229.36.120/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "20.62.248.141/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "20.83.144.189/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.1.219.207/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.1.36.99/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.120.223.25/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.121.24.234/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.18.172.189/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.18.188.104/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.18.197.0/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.36.177.119/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.92.150.182/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "3.96.7.126/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "34.208.32.189/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "35.154.93.182/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "35.176.195.46/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "35.177.43.250/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "40.76.107.170/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.192.175.207/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.35.61.232/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.55.56.26/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.60.189.53/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.67.95.251/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.89.221.151/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.9.13.199/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "52.9.139.134/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "54.177.155.33/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "63.34.100.178/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "63.35.33.198/32"
  }
  ip_set_descriptor {
    type  = "IPV4"
    value = "99.79.87.237/32"
  }
}

resource "aws_wafregional_regex_pattern_set" "block_regexp_pattern" {
  name = "${local.env_resource_prefix}-block-regexp-pattern"

  regex_pattern_strings = [
    "^${data.aws_ssm_parameter.cf_alb_pre_shared_key.value}$",
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
