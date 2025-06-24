"use client"

import { useTemplate } from "@/contexts/template-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"

export function TemplatePreview() {
  const { templateData, currentTemplate, templates, setCurrentTemplate, customTemplates } = useTemplate()
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const generateTemplateHTML = (template: string) => {
    const baseStyles = `
      body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
      .email-container { max-width: 600px; margin: 0 auto; background: white; }
      .header { padding: 30px 20px; text-align: center; }
      .content { padding: 30px 20px; }
      .footer { padding: 20px; text-align: center; background: #f8f9fa; font-size: 12px; color: #6b7280; }
      .button { display: inline-block; padding: 12px 24px; background-color: ${templateData.primaryColor}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
      .social-link { display: inline-block; margin: 0 5px; padding: 8px 12px; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; }
      h1, h2, h3 { margin: 0; }
      p { margin: 0 0 15px 0; line-height: 1.6; }
      ul { margin: 0; padding-left: 20px; }
      li { margin-bottom: 8px; }
    `

    // Check if it's a custom template
    if (template.startsWith("custom-")) {
      const customTemplate = customTemplates.find((t) => t.id === template)
      if (customTemplate) {
        // Replace template variables with actual data
        let html = customTemplate.html
        let css = customTemplate.css

        const replacements = {
          "{{companyName}}": templateData.companyName,
          "{{companyLogo}}": templateData.companyLogo,
          "{{heading}}": templateData.heading,
          "{{subheading}}": templateData.subheading,
          "{{mainText}}": templateData.content.mainText,
          "{{buttonText}}": templateData.buttonText,
          "{{buttonUrl}}": templateData.buttonUrl,
          "{{primaryColor}}": templateData.primaryColor,
          "{{secondaryColor}}": templateData.secondaryColor,
          "{{footerText}}": templateData.footerText,
          "{{facebookUrl}}": templateData.socialLinks.facebook,
          "{{twitterUrl}}": templateData.socialLinks.twitter,
          "{{instagramUrl}}": templateData.socialLinks.instagram,
          "{{linkedinUrl}}": templateData.socialLinks.linkedin,
        }

        Object.entries(replacements).forEach(([variable, value]) => {
          html = html.replace(new RegExp(variable, "g"), value)
          css = css.replace(new RegExp(variable, "g"), value)
        })

        return `<style>${css}</style>${html}`
      }
    }

    const templates = {
      modern: `
        <style>${baseStyles}</style>
        <div class="email-container">
          <div class="header" style="background: linear-gradient(135deg, ${templateData.primaryColor}, ${templateData.secondaryColor}); color: white;">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 60px; margin-bottom: 20px;">
            <h1 style="font-size: 28px; font-weight: 300;">${templateData.heading}</h1>
            <p style="font-size: 16px; opacity: 0.9; margin-top: 10px;">${templateData.subheading}</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #666;">${templateData.content.mainText}</p>
            <div style="background: #f8f9fa; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid ${templateData.primaryColor};">
              <h3 style="color: ${templateData.secondaryColor}; margin-bottom: 15px;">What you get:</h3>
              <ul style="color: #666;">
                ${templateData.content.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${templateData.buttonUrl}" class="button">${templateData.buttonText}</a>
            </div>
          </div>
          <div class="footer">
            <div style="margin-bottom: 15px;">
              <a href="${templateData.socialLinks.facebook}" class="social-link" style="background-color: #3b5998;">Facebook</a>
              <a href="${templateData.socialLinks.twitter}" class="social-link" style="background-color: #1da1f2;">Twitter</a>
              <a href="${templateData.socialLinks.instagram}" class="social-link" style="background-color: #e4405f;">Instagram</a>
              <a href="${templateData.socialLinks.linkedin}" class="social-link" style="background-color: #0077b5;">LinkedIn</a>
            </div>
            <p>${templateData.footerText}</p>
          </div>
        </div>
      `,
      classic: `
        <style>${baseStyles}</style>
        <div class="email-container" style="border: 2px solid ${templateData.primaryColor};">
          <div class="header" style="border-bottom: 2px solid ${templateData.primaryColor};">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 50px; margin-bottom: 15px;">
            <h1 style="color: ${templateData.primaryColor}; font-size: 24px;">${templateData.heading}</h1>
            <p style="color: ${templateData.secondaryColor}; margin-top: 10px;">${templateData.subheading}</p>
          </div>
          <div class="content">
            <p><strong>Dear Valued Customer,</strong></p>
            <p style="color: #666;">${templateData.content.mainText}</p>
            <div style="border: 1px solid #ddd; margin: 25px 0;">
              <div style="background-color: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; font-weight: bold;">Benefits Include:</div>
              ${templateData.content.features
                .map(
                  (feature) => `
                <div style="padding: 12px 15px; border-bottom: 1px solid #ddd;">✓ ${feature}</div>
              `,
                )
                .join("")}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${templateData.buttonUrl}" class="button">${templateData.buttonText}</a>
            </div>
            <p style="margin-top: 25px;">Best regards,<br><strong>The ${templateData.companyName} Team</strong></p>
          </div>
          <div class="footer" style="border-top: 2px solid ${templateData.primaryColor};">
            <p>${templateData.footerText}</p>
            <div style="margin-top: 10px;">
              <a href="${templateData.socialLinks.facebook}" class="social-link" style="background-color: #3b5998;">FB</a>
              <a href="${templateData.socialLinks.twitter}" class="social-link" style="background-color: #1da1f2;">TW</a>
              <a href="${templateData.socialLinks.instagram}" class="social-link" style="background-color: #e4405f;">IG</a>
              <a href="${templateData.socialLinks.linkedin}" class="social-link" style="background-color: #0077b5;">LI</a>
            </div>
          </div>
        </div>
      `,
      minimal: `
        <style>${baseStyles}</style>
        <div class="email-container">
          <div class="header" style="border-bottom: 3px solid ${templateData.primaryColor}; padding: 50px 30px;">
            <h1 style="font-weight: 300; color: ${templateData.secondaryColor}; font-size: 32px; letter-spacing: -1px;">${templateData.heading}</h1>
            <p style="color: #666; font-size: 18px; margin-top: 15px;">${templateData.subheading}</p>
          </div>
          <div class="content" style="padding: 50px 30px;">
            <p style="font-size: 18px; color: ${templateData.secondaryColor}; margin-bottom: 30px;">${templateData.content.mainText}</p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${templateData.buttonUrl}" style="display: inline-block; padding: 15px 35px; background-color: ${templateData.secondaryColor}; color: white; text-decoration: none; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">${templateData.buttonText}</a>
            </div>
            <div style="border-left: 3px solid ${templateData.primaryColor}; padding-left: 20px; margin: 30px 0; font-style: italic;">
              <p style="color: #666; font-size: 16px;">"${templateData.content.testimonial.text}"</p>
              <p style="color: #999; font-size: 14px; margin-top: 10px;">— ${templateData.content.testimonial.author}, ${templateData.content.testimonial.position}</p>
            </div>
          </div>
          <div class="footer" style="border-top: 1px solid #eee; padding: 30px;">
            <p>${templateData.footerText}</p>
          </div>
        </div>
      `,
      promotional: `
        <style>${baseStyles}</style>
        <div class="email-container">
          <div class="header" style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 40px 20px;">
            <div style="background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 15px; font-size: 12px; font-weight: bold;">🎉 SPECIAL OFFER</div>
            <h1 style="font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${templateData.heading}</h1>
            <p style="font-size: 18px; opacity: 0.95; margin-top: 10px;">${templateData.subheading}</p>
          </div>
          <div class="content">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h2 style="font-size: 24px; margin-bottom: 10px;">Limited Time Offer!</h2>
              <p style="opacity: 0.9;">${templateData.content.mainText}</p>
            </div>
            <div style="display: flex; justify-content: space-around; margin: 25px 0; text-align: center;">
              ${templateData.content.features
                .slice(0, 3)
                .map(
                  (feature) => `
                <div style="flex: 1; padding: 15px; margin: 0 5px; background: #f8f9fa; border-radius: 6px;">
                  <div style="font-size: 20px; margin-bottom: 8px;">✨</div>
                  <p style="font-size: 12px; color: #666;">${feature}</p>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${templateData.buttonUrl}" style="display: inline-block; padding: 18px 35px; background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255,107,107,0.4);">${templateData.buttonText}</a>
            </div>
          </div>
          <div class="footer" style="background: #2c3e50; color: white;">
            <div style="margin-bottom: 10px;">
              <a href="${templateData.socialLinks.facebook}" class="social-link" style="background-color: #3b5998;">📘</a>
              <a href="${templateData.socialLinks.twitter}" class="social-link" style="background-color: #1da1f2;">🐦</a>
              <a href="${templateData.socialLinks.instagram}" class="social-link" style="background-color: #e4405f;">📷</a>
            </div>
            <p style="color: #bdc3c7;">${templateData.footerText}</p>
          </div>
        </div>
      `,
      welcome: `
        <style>${baseStyles}</style>
        <div class="email-container">
          <div class="header" style="background-color: ${templateData.primaryColor}; color: white;">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 60px; margin-bottom: 20px;">
            <h1 style="font-size: 28px;">👋 ${templateData.heading}</h1>
            <p style="font-size: 16px; opacity: 0.9; margin-top: 10px;">${templateData.subheading}</p>
          </div>
          <div class="content">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="font-size: 20px; margin-bottom: 10px;">Welcome to the family! 🎉</h2>
              <p style="opacity: 0.9;">${templateData.content.mainText}</p>
            </div>
            <h3 style="color: ${templateData.secondaryColor}; margin: 25px 0 15px 0;">Here's what happens next:</h3>
            <div style="margin: 20px 0;">
              ${templateData.content.features
                .map(
                  (feature, index) => `
                <div style="display: flex; align-items: center; margin: 12px 0; padding: 12px; background: #f8f9fa; border-radius: 6px;">
                  <div style="background: ${templateData.primaryColor}; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 12px;">${index + 1}</div>
                  <p style="font-size: 14px; color: #666;">${feature}</p>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${templateData.buttonUrl}" class="button">${templateData.buttonText}</a>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745; margin: 25px 0;">
              <p style="color: #155724; font-size: 14px;"><strong>Need help?</strong> We're here for you! Reply to this email or contact our support team.</p>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 10px;">Follow us for updates:</p>
            <div style="margin-bottom: 10px;">
              <a href="${templateData.socialLinks.facebook}" class="social-link" style="background-color: #3b5998;">Facebook</a>
              <a href="${templateData.socialLinks.twitter}" class="social-link" style="background-color: #1da1f2;">Twitter</a>
              <a href="${templateData.socialLinks.instagram}" class="social-link" style="background-color: #e4405f;">Instagram</a>
            </div>
            <p style="font-size: 11px; color: #999;">${templateData.footerText}</p>
          </div>
        </div>
      `,
    }

    return templates[template as keyof typeof templates] || templates.modern
  }

  const getViewportStyles = () => {
    switch (viewMode) {
      case "mobile":
        return { maxWidth: "375px", transform: "scale(0.8)" }
      case "tablet":
        return { maxWidth: "768px", transform: "scale(0.9)" }
      default:
        return { maxWidth: "100%", transform: "scale(1)" }
    }
  }

  return (
    <div className="h-full bg-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Template Preview</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="w-4 h-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentTemplate === template.id ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() => setCurrentTemplate(template.id)}
            >
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{template.category}</div>
                  </div>
                  {currentTemplate === template.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-600">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                  style={{
                    ...getViewportStyles(),
                    transformOrigin: "top left",
                    height: "300px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateTemplateHTML(template.id),
                    }}
                    style={{
                      fontSize: viewMode === "mobile" ? "12px" : "14px",
                      lineHeight: "1.4",
                      zoom: viewMode === "mobile" ? "0.7" : viewMode === "tablet" ? "0.8" : "0.6",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {customTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentTemplate === template.id ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() => setCurrentTemplate(template.id)}
            >
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{template.category}</div>
                  </div>
                  {currentTemplate === template.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-600">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                  style={{
                    ...getViewportStyles(),
                    transformOrigin: "top left",
                    height: "300px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateTemplateHTML(template.id),
                    }}
                    style={{
                      fontSize: viewMode === "mobile" ? "12px" : "14px",
                      lineHeight: "1.4",
                      zoom: viewMode === "mobile" ? "0.7" : viewMode === "tablet" ? "0.8" : "0.6",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Template Data</CardTitle>
          <p className="text-sm text-gray-600">
            This data is shared across all templates - changes here update all layouts
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Company:</strong> {templateData.companyName}
            </div>
            <div>
              <strong>Heading:</strong> {templateData.heading}
            </div>
            <div>
              <strong>Subheading:</strong> {templateData.subheading}
            </div>
            <div>
              <strong>Button Text:</strong> {templateData.buttonText}
            </div>
            <div>
              <strong>Primary Color:</strong>
              <span
                className="inline-block w-4 h-4 ml-2 rounded border"
                style={{ backgroundColor: templateData.primaryColor }}
              />
              {templateData.primaryColor}
            </div>
            <div>
              <strong>Secondary Color:</strong>
              <span
                className="inline-block w-4 h-4 ml-2 rounded border"
                style={{ backgroundColor: templateData.secondaryColor }}
              />
              {templateData.secondaryColor}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
