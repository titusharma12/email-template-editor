"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Send, TestTube, Globe, Smartphone } from "lucide-react"

interface EmailServiceGuideProps {
  htmlTemplate: string
}

export function EmailServiceGuide({ htmlTemplate }: EmailServiceGuideProps) {
  const [testEmail, setTestEmail] = useState("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const emailServices = [
    {
      name: "Mailchimp",
      logo: "📧",
      steps: [
        "Log into your Mailchimp account",
        "Go to 'Campaigns' → 'Create Campaign' → 'Email'",
        "Choose 'Regular' campaign type",
        "Select your audience and continue",
        "In the 'Design' step, click 'Code your own'",
        "Select 'Import HTML'",
        "Paste your exported HTML code",
        "Preview and test your email",
        "Send or schedule your campaign",
      ],
      notes: "Mailchimp automatically inlines CSS and optimizes for email clients.",
    },
    {
      name: "SendGrid",
      logo: "🚀",
      steps: [
        "Login to SendGrid dashboard",
        "Go to 'Marketing' → 'Designs'",
        "Click 'Create a Design'",
        "Choose 'Code Editor'",
        "Replace the default HTML with your exported code",
        "Use the 'Preview' tab to test",
        "Save your design",
        "Create a campaign using this design",
      ],
      notes: "SendGrid preserves your HTML structure and inline styles perfectly.",
    },
    {
      name: "Constant Contact",
      logo: "📮",
      steps: [
        "Access your Constant Contact account",
        "Click 'Create' → 'Email Campaign'",
        "Select 'Custom Code' template",
        "Paste your HTML in the code editor",
        "Use 'Preview' to check appearance",
        "Test send to yourself",
        "Schedule or send immediately",
      ],
      notes: "May require some CSS adjustments for optimal rendering.",
    },
    {
      name: "Campaign Monitor",
      logo: "📊",
      steps: [
        "Login to Campaign Monitor",
        "Go to 'Templates' → 'Create Template'",
        "Choose 'Import HTML'",
        "Upload or paste your HTML code",
        "Preview across different email clients",
        "Save template",
        "Use in campaigns",
      ],
      notes: "Excellent email client testing and preview features.",
    },
    {
      name: "ConvertKit",
      logo: "🎯",
      steps: [
        "Access ConvertKit dashboard",
        "Go to 'Broadcasts' → 'Create Broadcast'",
        "Click 'HTML' in the editor",
        "Paste your exported HTML",
        "Preview your email",
        "Send test email",
        "Schedule or send broadcast",
      ],
      notes: "Great for content creators and course creators.",
    },
    {
      name: "Gmail (Personal)",
      logo: "✉️",
      steps: [
        "Open Gmail and click 'Compose'",
        "Click the 'More options' (three dots)",
        "Select 'Insert HTML'",
        "Paste your HTML code",
        "Preview the email",
        "Send to your test recipients",
      ],
      notes: "Limited HTML support. Best for simple templates.",
    },
  ]

  const testingTools = [
    {
      name: "Litmus",
      url: "https://litmus.com",
      description: "Test your email across 90+ email clients and devices",
      features: ["Email previews", "Spam testing", "Analytics", "Code validation"],
    },
    {
      name: "Email on Acid",
      url: "https://www.emailonacid.com",
      description: "Comprehensive email testing and optimization platform",
      features: ["Client testing", "Accessibility checks", "Dark mode testing", "Image blocking simulation"],
    },
    {
      name: "Mailtrap",
      url: "https://mailtrap.io",
      description: "Email testing for development teams",
      features: ["Safe email testing", "HTML/CSS validation", "Spam score analysis", "Team collaboration"],
    },
    {
      name: "Putsmail",
      url: "https://putsmail.com",
      description: "Free email testing tool",
      features: ["Send test emails", "HTML preview", "Simple interface", "No registration required"],
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Email Service Integration Guide</h1>
        <p className="text-gray-600">
          Learn how to use your exported HTML template in popular email marketing services and test it properly.
        </p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Email Services</TabsTrigger>
          <TabsTrigger value="testing">Testing Tools</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="tips">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {emailServices.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{service.logo}</span>
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {service.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-gray-700">
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> {service.notes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {testingTools.map((tool, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-4" onClick={() => window.open(tool.url, "_blank")}>
                    Visit {tool.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Test Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="test-email">Send test email to:</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    const subject = "Test Email Template"
                    const body = encodeURIComponent(htmlTemplate)
                    const mailtoLink = `mailto:${testEmail}?subject=${subject}&body=${body}`
                    window.location.href = mailtoLink
                  }}
                  disabled={!testEmail}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Test Email
                </Button>
                <p className="text-sm text-gray-600">
                  This will open your default email client with the HTML template.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Email Preview
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
                <div className={`mx-auto bg-white shadow-lg ${previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"}`}>
                  <iframe srcDoc={htmlTemplate} className="w-full h-96 border-0" title="Email Preview" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTML Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea value={htmlTemplate} readOnly className="h-40 font-mono text-sm" />
                <Button onClick={() => copyToClipboard(htmlTemplate)} className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy HTML Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>✅ Email HTML Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use inline CSS for better email client support</li>
                  <li>• Keep width under 600px for desktop compatibility</li>
                  <li>• Use table-based layouts for complex designs</li>
                  <li>• Always include alt text for images</li>
                  <li>• Test across multiple email clients</li>
                  <li>• Use web-safe fonts as fallbacks</li>
                  <li>• Optimize images for fast loading</li>
                  <li>• Include a plain text version</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚠️ Common Issues to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Don't rely on external CSS files</li>
                  <li>• Avoid JavaScript (not supported)</li>
                  <li>• Don't use background images in Outlook</li>
                  <li>• Avoid CSS Grid and Flexbox</li>
                  <li>• Don't use video elements</li>
                  <li>• Minimize use of web fonts</li>
                  <li>• Don't forget mobile optimization</li>
                  <li>• Avoid complex CSS animations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use responsive design principles</li>
                  <li>• Make buttons at least 44px tall</li>
                  <li>• Use larger font sizes (14px minimum)</li>
                  <li>• Stack columns on mobile</li>
                  <li>• Optimize images for retina displays</li>
                  <li>• Test on actual mobile devices</li>
                  <li>• Consider dark mode compatibility</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔍 Testing Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Gmail (web, mobile app)</li>
                  <li>• Outlook (desktop, web, mobile)</li>
                  <li>• Apple Mail (desktop, iOS)</li>
                  <li>• Yahoo Mail</li>
                  <li>• Thunderbird</li>
                  <li>• Dark mode rendering</li>
                  <li>• Image blocking scenarios</li>
                  <li>• Spam filter testing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
