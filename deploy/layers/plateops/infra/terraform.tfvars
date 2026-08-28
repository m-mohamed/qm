org_id                            = "plateops"
account_id                        = "017719539381"
region                            = "us-east-1"
cluster_name                      = "plateops-qm"
public_url                        = "https://plateops.mnfstlabs.dev"
cloud_map_namespace               = "plateops.internal"
secrets_prefix                    = "plateops/qm/"
github_oidc_provider_arn          = "arn:aws:iam::017719539381:oidc-provider/token.actions.githubusercontent.com"
github_environment                = ""
object_store_bucket               = "qm-plateops-129d5a36ccfb"
transfer_lifecycle_prefix         = "transfer/"
deploy_microvm_image              = "plateops-qm-sandbox"
deploy_microvm_execution_role_arn = "arn:aws:iam::017719539381:role/plateops-qm-microvm-exec"
github_repository                 = "corvus-inc-hub/qm-private"
github_ref                        = "refs/heads/main"
certificate_arn                   = ""
services = {
  "core" : {
    "ecr_repository" : "plateops-qm-core",
    "ecs_service" : "plateops-qm-core",
    "cpu" : 2048,
    "memory" : 4096,
    "architecture" : "amd64",
    "internal_port" : 8080
  },
  "web-ui" : {
    "ecr_repository" : "plateops-qm-web-ui",
    "ecs_service" : "plateops-qm-web-ui",
    "cpu" : 512,
    "memory" : 1024,
    "architecture" : "amd64",
    "internal_port" : 8080
  },
  "admin" : {
    "ecr_repository" : "plateops-qm-admin",
    "ecs_service" : "plateops-qm-admin",
    "cpu" : 512,
    "memory" : 1024,
    "architecture" : "amd64",
    "internal_port" : 8080
  },
  "portal" : {
    "ecr_repository" : "plateops-qm-portal",
    "ecs_service" : "plateops-qm-portal",
    "cpu" : 512,
    "memory" : 1024,
    "architecture" : "amd64",
    "internal_port" : 8080
  },
  "auth" : {
    "ecr_repository" : "plateops-qm-auth",
    "ecs_service" : "plateops-qm-auth",
    "cpu" : 256,
    "memory" : 512,
    "architecture" : "amd64",
    "internal_port" : 8080
  }
}
secret_names = [
  "ADMIN_GRANTS",
  "ANTHROPIC_API_KEY",
  "AUTH_ALLOWED_EMAILS",
  "AUTH_CLIENT_SECRET",
  "AUTH_EMAIL_FROM",
  "AUTH_SIGNING_JWK",
  "AUTH_TOKEN_SECRET",
  "CAPABILITY_SECRET",
  "CONNECTOR_SECRET_KEY",
  "CORE_SIGNING_SECRET",
  "DATABASE_CA_CERT",
  "DATABASE_URL",
  "OPENROUTER_API_KEY",
  "PORTAL_IDENTITY_SECRET",
  "PORTAL_SESSION_SECRET",
  "PUBLIC_API_URL",
  "SKILL_SIGNING_SECRET",
  "SLACK_APP_TOKEN",
  "SLACK_BOT_TOKEN",
  "SMTP_HOST",
  "SMTP_PASSWORD",
  "SMTP_USERNAME"
]
