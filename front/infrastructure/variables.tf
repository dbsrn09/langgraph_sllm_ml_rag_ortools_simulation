variable "resource_group_name" {
  description = "Name of the resource group"
  default     = "CS_RAG_RG"
}

variable "location" {
  description = "Azure region"
  default     = "Korea Central"
}

variable "acr_name" {
  description = "Name of the Container Registry"
  default     = "dataagentuiacr"
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  default     = "mcloud"
}

variable "app_service_name" {
  description = "Base name for the App Service"
  default     = "mcloud-dataagent"
}

variable "image_name" {
  description = "Docker image name to deploy"
  default     = "data-agent-ui"
}
