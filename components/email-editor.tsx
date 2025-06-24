"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTemplate } from "@/contexts/template-context"
import { GrapesEditor } from "@/components/grapes-editor"
import { TemplatePreview } from "@/components/template-preview"
import { CustomTemplateManager } from "@/components/custom-template-manager"
import { Eye, Settings, Code, Palette, Building, Globe, Plus } from "lucide-react"

export function EmailEditor() {
  const { templateData, updateTemplateData, currentTemplate, setCurrentTemplate, templates } = useTemplate()
  const [activeTab, setActiveTab] = useState("editor")

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">Email Template Editor</h1>
          <p className="text-sm text-gray-600 mt-1">Design beautiful email templates with centralized data</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Template Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentTemplate} onValueChange={setCurrentTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-gray-500">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                All templates use the same data - change layout without losing content
              </p>
            </CardContent>
          </Card>

          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={templateData.companyName}
                  onChange={(e) => updateTemplateData({ companyName: e.target.value })}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="company-logo">Company Logo URL</Label>
                <Input
                  id="company-logo"
                  value={templateData.companyLogo}
                  onChange={(e) => updateTemplateData({ companyLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heading">Main Heading</Label>
                <Input
                  id="heading"
                  value={templateData.heading}
                  onChange={(e) => updateTemplateData({ heading: e.target.value })}
                  placeholder="Welcome to Our Newsletter"
                />
              </div>

              <div>
                <Label htmlFor="subheading">Subheading</Label>
                <Input
                  id="subheading"
                  value={templateData.subheading}
                  onChange={(e) => updateTemplateData({ subheading: e.target.value })}
                  placeholder="Stay updated with our latest news"
                />
              </div>

              <div>
                <Label htmlFor="main-text">Main Content</Label>
                <Textarea
                  id="main-text"
                  value={templateData.content.mainText}
                  onChange={(e) =>
                    updateTemplateData({
                      content: { ...templateData.content, mainText: e.target.value },
                    })
                  }
                  rows={3}
                  placeholder="Your main email content..."
                />
              </div>

              <div>
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={templateData.buttonText}
                  onChange={(e) => updateTemplateData({ buttonText: e.target.value })}
                  placeholder="Get Started Today"
                />
              </div>

              <div>
                <Label htmlFor="button-url">Button URL</Label>
                <Input
                  id="button-url"
                  value={templateData.buttonUrl}
                  onChange={(e) => updateTemplateData({ buttonUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={templateData.primaryColor}
                    onChange={(e) => updateTemplateData({ primaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={templateData.primaryColor}
                    onChange={(e) => updateTemplateData({ primaryColor: e.target.value })}
                    className="flex-1"
                    placeholder="#007cba"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={templateData.secondaryColor}
                    onChange={(e) => updateTemplateData({ secondaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={templateData.secondaryColor}
                    onChange={(e) => updateTemplateData({ secondaryColor: e.target.value })}
                    className="flex-1"
                    placeholder="#333333"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={templateData.socialLinks.facebook}
                  onChange={(e) =>
                    updateTemplateData({
                      socialLinks: { ...templateData.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={templateData.socialLinks.twitter}
                  onChange={(e) =>
                    updateTemplateData({
                      socialLinks: { ...templateData.socialLinks, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={templateData.socialLinks.instagram}
                  onChange={(e) =>
                    updateTemplateData({
                      socialLinks: { ...templateData.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourcompany"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={templateData.socialLinks.linkedin}
                  onChange={(e) =>
                    updateTemplateData({
                      socialLinks: { ...templateData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="footer-text">Footer Text</Label>
                <Textarea
                  id="footer-text"
                  value={templateData.footerText}
                  onChange={(e) => updateTemplateData({ footerText: e.target.value })}
                  rows={3}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white p-4">
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Custom Templates
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="editor" className="h-full m-0">
              <GrapesEditor />
            </TabsContent>
            <TabsContent value="preview" className="h-full m-0 p-4 overflow-y-auto">
              <TemplatePreview />
            </TabsContent>
            <TabsContent value="custom" className="h-full m-0 p-6 overflow-y-auto">
              <CustomTemplateManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
