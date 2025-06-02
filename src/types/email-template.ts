export type EmailTemplateType =
  | "welcome"
  | "event_invitation"
  | "event_reminder"
  | "event_confirmation"
  | "certificate_issued"
  | "password_reset"
  | "account_verification"
  | "custom"

export interface EmailVariable {
  key: string
  description: string
  example: string
  category: "user" | "event" | "certificate" | "system" | "custom"
}

export interface EmailTemplate {
  id: string
  name: string
  type: EmailTemplateType
  subject: string
  htmlContent: string
  textContent: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
  lastSentAt?: string
  variables?: EmailVariable[]
}

export interface EmailTemplateFormData {
  name: string
  type: EmailTemplateType
  subject: string
  htmlContent: string
  textContent: string
  isActive: boolean
}

export interface EmailPreviewData {
  to: string
  subject: string
  htmlContent: string
  textContent: string
}

export interface SendTestEmailResponse {
  success: boolean
  message: string
}
