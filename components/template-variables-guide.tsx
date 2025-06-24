"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Palette, Type, Link, Building } from "lucide-react"

export function TemplateVariablesGuide() {
  const variableCategories = [
    {
      category: "Company Information",
      icon: <Building className="w-4 h-4" />,
      variables: [
        { name: "{{companyName}}", description: "Your company name", example: "Acme Corp" },
        { name: "{{companyLogo}}", description: "Company logo URL", example: "https://example.com/logo.png" },
      ],
    },
    {
      category: "Content",
      icon: <Type className="w-4 h-4" />,
      variables: [
        { name: "{{heading}}", description: "Main email heading", example: "Welcome to Our Newsletter" },
        { name: "{{subheading}}", description: "Email subheading", example: "Stay updated with our latest news" },
        { name: "{{mainText}}", description: "Main email content", example: "We're excited to share..." },
        { name: "{{footerText}}", description: "Footer text", example: "© 2024 Your Company" },
      ],
    },
    {
      category: "Call to Action",
      icon: <Link className="w-4 h-4" />,
      variables: [
        { name: "{{buttonText}}", description: "Button text", example: "Get Started" },
        { name: "{{buttonUrl}}", description: "Button URL", example: "https://example.com" },
      ],
    },
    {
      category: "Colors",
      icon: <Palette className="w-4 h-4" />,
      variables: [
        { name: "{{primaryColor}}", description: "Primary brand color", example: "#007cba" },
        { name: "{{secondaryColor}}", description: "Secondary brand color", example: "#333333" },
      ],
    },
    {
      category: "Social Media",
      icon: <Link className="w-4 h-4" />,
      variables: [
        { name: "{{facebookUrl}}", description: "Facebook page URL", example: "https://facebook.com/company" },
        { name: "{{twitterUrl}}", description: "Twitter profile URL", example: "https://twitter.com/company" },
        { name: "{{instagramUrl}}", description: "Instagram profile URL", example: "https://instagram.com/company" },
        { name: "{{linkedinUrl}}", description: "LinkedIn page URL", example: "https://linkedin.com/company" },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Template Variables Guide
        </CardTitle>
        <p className="text-sm text-gray-600">
          Use these variables in your custom templates to automatically populate content from your centralized data.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {variableCategories.map((category, index) => (
          <div key={index}>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              {category.icon}
              {category.category}
            </h3>
            <div className="grid gap-3">
              {category.variables.map((variable, varIndex) => (
                <div key={varIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {variable.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{variable.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Example:</p>
                    <p className="text-sm font-medium">{variable.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Variables work in both HTML and CSS sections</li>
            <li>• Use variables to maintain consistency across all templates</li>
            <li>• Changes to centralized data automatically update all custom templates</li>
            <li>• Variables are case-sensitive, so use exact spelling</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">📝 Example Usage:</h4>
          <div className="bg-white p-3 rounded border font-mono text-sm">
            <div className="text-gray-600">HTML:</div>
            <code className="text-green-700">
              {`<h1 style="color: {{primaryColor}}">{{heading}}</h1>
<p>{{mainText}}</p>
<a href="{{buttonUrl}}">{{buttonText}}</a>`}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
