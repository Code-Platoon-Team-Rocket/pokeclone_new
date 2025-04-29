resource "aws_sns_topic" "cpu_alarm_topic" {
  name = "eks-cpu-alarm-topic"
}

resource "aws_sns_topic_subscription" "cpu_alarm_email" {
  topic_arn = aws_sns_topic.cpu_alarm_topic.arn
  protocol  = "email"
  endpoint  = "flomihciu@gmail.com"
}

data "aws_instances" "eks_nodes" {
  filter {
    name   = "tag:kubernetes.io/cluster/team-rocket-eks"
    values = ["owned"]
  }

  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}

resource "aws_cloudwatch_metric_alarm" "eks_cpu_high" {
  for_each            = toset(data.aws_instances.eks_nodes.ids)
  alarm_name          = "eks-node-${each.key}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 50
  treat_missing_data  = "missing"

  alarm_description = "Triggered when EKS node CPU exceeds 50%"

  dimensions = {
    InstanceId = each.value
  }

  alarm_actions = [aws_sns_topic.cpu_alarm_topic.arn]
}

resource "aws_sns_topic" "rds_snapshot_topic" {
  name = "rds-snapshot-topic"
}

resource "aws_sns_topic_subscription" "rds_email_alert" {
  topic_arn = aws_sns_topic.rds_snapshot_topic.arn
  protocol  = "email"
  endpoint  = "flomihciu@gmail.com"
}

resource "aws_db_event_subscription" "snapshot_event" {
  name             = "rds-snapshot-subscription"
  sns_topic        = aws_sns_topic.rds_snapshot_topic.arn
  source_type      = "db-instance"
  event_categories = ["backup"]
  source_ids       = ["team-rocket-postgres-db"]
  enabled          = true
}
