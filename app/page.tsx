"use client"

import { TemplateProvider } from "@/contexts/template-context"
import { EmailEditor } from "@/components/email-editor"

export default function Home() {
  return (
    <TemplateProvider>
      <div className="min-h-screen bg-gray-50">
        <EmailEditor />
      </div>
    </TemplateProvider>
  )
}
