"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface TemplateData {
  heading: string
  subheading: string
  companyName: string
  companyLogo: string
  primaryColor: string
  secondaryColor: string
  buttonText: string
  buttonUrl: string
  footerText: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
  content: {
    mainText: string
    features: string[]
    testimonial: {
      text: string
      author: string
      position: string
    }
  }
}

export interface CustomTemplate {
  id: string
  name: string
  description: string
  category: string
  html: string
  css: string
  createdAt: Date
  updatedAt: Date
}

interface TemplateContextType {
  templateData: TemplateData
  updateTemplateData: (data: Partial<TemplateData>) => void
  currentTemplate: string
  setCurrentTemplate: (template: string) => void
  templates: Array<{
    id: string
    name: string
    description: string
    category: string
  }>
  customTemplates: CustomTemplate[]
  addCustomTemplate: (template: Omit<CustomTemplate, "id" | "createdAt" | "updatedAt">) => void
  updateCustomTemplate: (id: string, updates: Partial<CustomTemplate>) => void
  deleteCustomTemplate: (id: string) => void
  duplicateTemplate: (templateId: string, newName: string) => void
}

const defaultTemplateData: TemplateData = {
  heading: "Welcome to Our Newsletter",
  subheading: "Stay updated with our latest news and exclusive offers",
  companyName: "Your Company",
  companyLogo: "https://via.placeholder.com/200x60/007cba/ffffff?text=LOGO",
  primaryColor: "#007cba",
  secondaryColor: "#333333",
  buttonText: "Get Started Today",
  buttonUrl: "https://example.com",
  footerText:
    "© 2024 Your Company. All rights reserved. You received this email because you subscribed to our newsletter.",
  socialLinks: {
    facebook: "https://facebook.com/yourcompany",
    twitter: "https://twitter.com/yourcompany",
    instagram: "https://instagram.com/yourcompany",
    linkedin: "https://linkedin.com/company/yourcompany",
  },
  content: {
    mainText:
      "We're excited to share our latest updates and exclusive content with you. Our team has been working hard to bring you the best experience possible.",
    features: [
      "Premium content access",
      "Exclusive member benefits",
      "24/7 customer support",
      "Regular updates and news",
    ],
    testimonial: {
      text: "This service has completely transformed how we do business. Highly recommended!",
      author: "John Smith",
      position: "CEO, Tech Corp",
    },
  },
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templateData, setTemplateData] = useState<TemplateData>(defaultTemplateData)
  const [currentTemplate, setCurrentTemplate] = useState<string>("modern")
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom-email-templates")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const templates = [
    {
      id: "modern",
      name: "Modern Newsletter",
      description: "Clean, contemporary design with gradient header",
      category: "Newsletter",
    },
    {
      id: "classic",
      name: "Classic Business",
      description: "Traditional professional layout with borders",
      category: "Business",
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description: "Simple, elegant design with focus on content",
      category: "Minimal",
    },
    {
      id: "promotional",
      name: "Promotional Sale",
      description: "Eye-catching design for sales and promotions",
      category: "Marketing",
    },
    {
      id: "welcome",
      name: "Welcome Series",
      description: "Perfect for onboarding new subscribers",
      category: "Onboarding",
    },
  ]

  const updateTemplateData = (data: Partial<TemplateData>) => {
    setTemplateData((prev) => ({ ...prev, ...data }))
  }

  const addCustomTemplate = (template: Omit<CustomTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: CustomTemplate = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedTemplates = [...customTemplates, newTemplate]
    setCustomTemplates(updatedTemplates)
    localStorage.setItem("custom-email-templates", JSON.stringify(updatedTemplates))
  }

  const updateCustomTemplate = (id: string, updates: Partial<CustomTemplate>) => {
    const updatedTemplates = customTemplates.map((template) =>
      template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template,
    )
    setCustomTemplates(updatedTemplates)
    localStorage.setItem("custom-email-templates", JSON.stringify(updatedTemplates))
  }

  const deleteCustomTemplate = (id: string) => {
    const updatedTemplates = customTemplates.filter((template) => template.id !== id)
    setCustomTemplates(updatedTemplates)
    localStorage.setItem("custom-email-templates", JSON.stringify(updatedTemplates))
  }

  const duplicateTemplate = (templateId: string, newName: string) => {
    const templateToDuplicate = customTemplates.find((t) => t.id === templateId)
    if (templateToDuplicate) {
      addCustomTemplate({
        ...templateToDuplicate,
        name: newName,
        description: `Copy of ${templateToDuplicate.description}`,
      })
    }
  }

  return (
    <TemplateContext.Provider
      value={{
        templateData,
        updateTemplateData,
        currentTemplate,
        setCurrentTemplate,
        templates,
        customTemplates,
        addCustomTemplate,
        updateCustomTemplate,
        deleteCustomTemplate,
        duplicateTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider")
  }
  return context
}
