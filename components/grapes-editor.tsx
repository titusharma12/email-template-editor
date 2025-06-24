"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useTemplate } from "@/contexts/template-context"
import { Save, Download, Copy, Eye, EyeOff, RefreshCw, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"

declare global {
  interface Window {
    grapesjs: any
  }
}

const templates = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "promotional", name: "Promotional" },
  { id: "welcome", name: "Welcome" },
]

export function GrapesEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedHtml, setSavedHtml] = useState("")
  const [showCode, setShowCode] = useState(false)
  const { templateData, currentTemplate, customTemplates, addCustomTemplate } = useTemplate()
  const [loadingStep, setLoadingStep] = useState("Initializing...")
  const [retryCount, setRetryCount] = useState(0)

  const updateEditorContent = () => {
    const templateContent = generateTemplateContent()
    if (editorInstance.current) {
      editorInstance.current.setComponents(templateContent)
    }
  }

  const loadGrapesJS = async () => {
    try {
      // Check if GrapesJS is already loaded
      if (window.grapesjs) {
        console.log("GrapesJS already loaded, initializing...")
        initializeEditor()
        return
      }

      console.log("Loading GrapesJS from CDN...")

      // Try multiple CDN sources
      const cdnSources = [
        {
          css: "https://unpkg.com/grapesjs@0.21.7/dist/css/grapes.min.css",
          js: "https://unpkg.com/grapesjs@0.21.7/dist/grapes.min.js",
        },
        {
          css: "https://cdn.jsdelivr.net/npm/grapesjs@0.21.7/dist/css/grapes.min.css",
          js: "https://cdn.jsdelivr.net/npm/grapesjs@0.21.7/dist/grapes.min.js",
        },
      ]

      let loaded = false

      for (const source of cdnSources) {
        try {
          console.log(`Trying CDN source: ${source.js}`)

          // Load CSS
          const cssLink = document.createElement("link")
          cssLink.rel = "stylesheet"
          cssLink.href = source.css
          document.head.appendChild(cssLink)

          // Load JS with timeout
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = source.js
            script.async = true

            const timeout = setTimeout(() => {
              reject(new Error("Script loading timeout"))
            }, 10000) // 10 second timeout

            script.onload = () => {
              clearTimeout(timeout)
              console.log("GrapesJS script loaded successfully")
              resolve(true)
            }

            script.onerror = () => {
              clearTimeout(timeout)
              reject(new Error("Script loading failed"))
            }

            document.head.appendChild(script)
          })

          // Check if GrapesJS is available
          if (window.grapesjs) {
            console.log("GrapesJS loaded successfully")
            loaded = true
            break
          }
        } catch (err) {
          console.warn(`Failed to load from ${source.js}:`, err)
          continue
        }
      }

      if (!loaded) {
        throw new Error("Failed to load GrapesJS from all CDN sources")
      }

      // Wait a bit for GrapesJS to fully initialize
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (window.grapesjs) {
        console.log("Initializing GrapesJS editor...")
        initializeEditor()
      } else {
        throw new Error("GrapesJS not available after loading")
      }
    } catch (err) {
      console.error("Error loading GrapesJS:", err)
      setError(`Failed to load GrapesJS: ${err.message}`)
    }
  }

  const initializeEditor = () => {
    if (!editorRef.current || !window.grapesjs) {
      console.error("Editor initialization failed: missing requirements")
      setError("Editor initialization failed")
      return
    }

    try {
      console.log("Creating GrapesJS instance...")

      editorInstance.current = window.grapesjs.init({
        container: editorRef.current,
        height: "600px",
        width: "100%",
        storageManager: false,
        fromElement: false,
        showOffsets: true,
        noticeOnUnload: false,
        blockManager: {
          appendTo: "#blocks",
          blocks: [
            {
              id: "text",
              label: "Text",
              content: '<div style="padding: 10px; font-family: Arial, sans-serif;">Insert your text here</div>',
              category: "Basic",
            },
            {
              id: "heading",
              label: "Heading",
              content:
                '<h2 style="margin: 0; padding: 10px; font-family: Arial, sans-serif; color: #333;">Your Heading</h2>',
              category: "Basic",
            },
            {
              id: "image",
              label: "Image",
              content:
                '<img src="https://via.placeholder.com/300x200" style="width: 100%; height: auto; display: block;" alt="Image"/>',
              category: "Basic",
            },
            {
              id: "button",
              label: "Button",
              content: `<a href="#" style="display: inline-block; padding: 12px 24px; background-color: ${templateData.primaryColor}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-family: Arial, sans-serif;">Click Me</a>`,
              category: "Basic",
            },
            {
              id: "divider",
              label: "Divider",
              content: '<hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 20px 0;">',
              category: "Basic",
            },
            {
              id: "spacer",
              label: "Spacer",
              content: '<div style="height: 30px;"></div>',
              category: "Basic",
            },
            {
              id: "social-links",
              label: "Social Links",
              content: `
                <div style="text-align: center; padding: 20px;">
                  <a href="${templateData.socialLinks.facebook}" style="display: inline-block; margin: 0 10px; padding: 8px; background-color: #3b5998; color: white; text-decoration: none; border-radius: 4px;">Facebook</a>
                  <a href="${templateData.socialLinks.twitter}" style="display: inline-block; margin: 0 10px; padding: 8px; background-color: #1da1f2; color: white; text-decoration: none; border-radius: 4px;">Twitter</a>
                  <a href="${templateData.socialLinks.instagram}" style="display: inline-block; margin: 0 10px; padding: 8px; background-color: #e4405f; color: white; text-decoration: none; border-radius: 4px;">Instagram</a>
                </div>
              `,
              category: "Social",
            },
            {
              id: "footer",
              label: "Footer",
              content: `
                <footer style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; font-family: Arial, sans-serif;">
                  <p style="margin: 0;">${templateData.footerText}</p>
                </footer>
              `,
              category: "Layout",
            },
          ],
        },
        layerManager: {
          appendTo: "#layers",
        },
        styleManager: {
          appendTo: "#styles",
          sectors: [
            {
              name: "General",
              open: false,
              buildProps: ["float", "display", "position", "top", "right", "left", "bottom"],
            },
            {
              name: "Dimension",
              open: false,
              buildProps: ["width", "height", "max-width", "min-height", "margin", "padding"],
            },
            {
              name: "Typography",
              open: false,
              buildProps: [
                "font-family",
                "font-size",
                "font-weight",
                "letter-spacing",
                "color",
                "line-height",
                "text-align",
                "text-decoration",
                "text-shadow",
              ],
            },
            {
              name: "Decorations",
              open: false,
              buildProps: ["opacity", "background-color", "border-radius", "border", "box-shadow", "background"],
            },
            {
              name: "Extra",
              open: false,
              buildProps: ["transition", "perspective", "transform"],
            },
          ],
        },
      })

      console.log("GrapesJS instance created successfully")

      // Set initial template content
      setTimeout(() => {
        if (editorInstance.current) {
          console.log("Setting initial template content...")
          updateEditorContent()
          setIsLoaded(true)
          setError(null)
          console.log("Editor initialization complete!")
        }
      }, 1000)
    } catch (err) {
      console.error("GrapesJS initialization error:", err)
      setError(`Failed to initialize editor: ${err.message}`)
    }
  }

  useEffect(() => {
    let mounted = true

    loadGrapesJS()

    return () => {
      mounted = false
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
        } catch (e) {
          console.warn("Error destroying editor:", e)
        }
      }
    }
  }, [])

  // Update editor content when template or data changes
  useEffect(() => {
    if (editorInstance.current && isLoaded) {
      updateEditorContent()
    }
  }, [templateData, currentTemplate, isLoaded])

  // Add this function to handle custom template rendering
  const renderCustomTemplate = (templateId: string) => {
    const customTemplate = customTemplates.find((t) => t.id === templateId)
    if (!customTemplate) return ""

    // Replace template variables with actual data
    let html = customTemplate.html
    let css = customTemplate.css

    // Replace common template variables
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

    // Replace variables in HTML and CSS
    Object.entries(replacements).forEach(([variable, value]) => {
      html = html.replace(new RegExp(variable, "g"), value)
      css = css.replace(new RegExp(variable, "g"), value)
    })

    return `<style>${css}</style>${html}`
  }

  const generateTemplateContent = () => {
    // Check if current template is a custom template
    if (currentTemplate.startsWith("custom-")) {
      return renderCustomTemplate(currentTemplate)
    }

    const baseStyles = {
      container: "font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;",
      header: `background-color: ${templateData.primaryColor}; color: white; padding: 30px 20px; text-align: center;`,
      content: "padding: 30px 20px;",
      footer:
        "background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;",
      button: `display: inline-block; padding: 15px 30px; background-color: ${templateData.primaryColor}; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;`,
      socialLink:
        "display: inline-block; margin: 0 5px; padding: 8px 12px; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;",
    }

    const templatesContent = {
      modern: `
        <div style="${baseStyles.container}">
          <header style="background: linear-gradient(135deg, ${templateData.primaryColor}, ${templateData.secondaryColor}); color: white; padding: 40px 20px; text-align: center;">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 60px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300;">${templateData.heading}</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">${templateData.subheading}</p>
          </header>
          
          <section style="${baseStyles.content}">
            <p style="color: #666; line-height: 1.6; font-size: 16px; margin: 0 0 25px 0;">${templateData.content.mainText}</p>
            
            <div style="background: #f8f9fa; padding: 25px; margin: 30px 0; border-radius: 8px; border-left: 4px solid ${templateData.primaryColor};">
              <h3 style="margin: 0 0 15px 0; color: ${templateData.secondaryColor};">What you get:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                ${templateData.content.features.map((feature) => `<li style="margin-bottom: 8px;">${feature}</li>`).join("")}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${templateData.buttonUrl}" style="${baseStyles.button}">${templateData.buttonText}</a>
            </div>
          </section>
          
          <footer style="${baseStyles.footer}">
            <div style="margin-bottom: 15px;">
              <a href="${templateData.socialLinks.facebook}" style="${baseStyles.socialLink} background-color: #3b5998;">Facebook</a>
              <a href="${templateData.socialLinks.twitter}" style="${baseStyles.socialLink} background-color: #1da1f2;">Twitter</a>
              <a href="${templateData.socialLinks.instagram}" style="${baseStyles.socialLink} background-color: #e4405f;">Instagram</a>
              <a href="${templateData.socialLinks.linkedin}" style="${baseStyles.socialLink} background-color: #0077b5;">LinkedIn</a>
            </div>
            <p style="margin: 0;">${templateData.footerText}</p>
          </footer>
        </div>
      `,
      classic: `
        <div style="${baseStyles.container} border: 2px solid ${templateData.primaryColor};">
          <header style="background-color: white; padding: 30px 20px; text-align: center; border-bottom: 2px solid ${templateData.primaryColor};">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 50px; margin-bottom: 15px;">
            <h1 style="margin: 0; color: ${templateData.primaryColor}; font-size: 28px;">${templateData.heading}</h1>
            <p style="margin: 10px 0 0 0; color: ${templateData.secondaryColor}; font-size: 16px;">${templateData.subheading}</p>
          </header>
          
          <section style="${baseStyles.content}">
            <p style="font-size: 16px;"><strong>Dear Valued Customer,</strong></p>
            <p style="color: #666; line-height: 1.6; margin: 20px 0;">${templateData.content.mainText}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 15px; border: 1px solid #ddd; font-weight: bold;">Benefits Include:</td>
              </tr>
              ${templateData.content.features
                .map(
                  (feature) => `
                <tr>
                  <td style="padding: 12px 15px; border: 1px solid #ddd;">✓ ${feature}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${templateData.buttonUrl}" style="${baseStyles.button}">${templateData.buttonText}</a>
            </div>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>The ${templateData.companyName} Team</strong></p>
          </section>
          
          <footer style="${baseStyles.footer} background-color: #f8f9fa; border-top: 2px solid ${templateData.primaryColor};">
            <p style="margin: 0 0 10px 0;">${templateData.footerText}</p>
            <div>
              <a href="${templateData.socialLinks.facebook}" style="${baseStyles.socialLink} background-color: #3b5998;">FB</a>
              <a href="${templateData.socialLinks.twitter}" style="${baseStyles.socialLink} background-color: #1da1f2;">TW</a>
              <a href="${templateData.socialLinks.instagram}" style="${baseStyles.socialLink} background-color: #e4405f;">IG</a>
              <a href="${templateData.socialLinks.linkedin}" style="${baseStyles.socialLink} background-color: #0077b5;">LI</a>
            </div>
          </footer>
        </div>
      `,
      minimal: `
        <div style="${baseStyles.container}">
          <header style="padding: 50px 30px; text-align: center; border-bottom: 3px solid ${templateData.primaryColor};">
            <h1 style="margin: 0; font-weight: 300; color: ${templateData.secondaryColor}; font-size: 36px; letter-spacing: -1px;">${templateData.heading}</h1>
            <p style="margin: 20px 0 0 0; color: #666; font-size: 18px;">${templateData.subheading}</p>
          </header>
          
          <section style="padding: 60px 30px;">
            <p style="font-size: 18px; line-height: 1.8; color: ${templateData.secondaryColor}; margin: 0 0 40px 0;">${templateData.content.mainText}</p>
            
            <div style="text-align: center; margin: 50px 0;">
              <a href="${templateData.buttonUrl}" style="display: inline-block; padding: 18px 40px; background-color: ${templateData.secondaryColor}; color: white; text-decoration: none; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">${templateData.buttonText}</a>
            </div>
            
            <div style="border-left: 3px solid ${templateData.primaryColor}; padding-left: 25px; margin: 40px 0; font-style: italic;">
              <p style="margin: 0; font-size: 16px; color: #666;">"${templateData.content.testimonial.text}"</p>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">— ${templateData.content.testimonial.author}, ${templateData.content.testimonial.position}</p>
            </div>
          </section>
          
          <footer style="padding: 40px 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 20px 0; font-size: 12px; color: #999;">${templateData.footerText}</p>
          </footer>
        </div>
      `,
      promotional: `
        <div style="${baseStyles.container}">
          <header style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 40px 20px; text-align: center; position: relative;">
            <div style="background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 25px; display: inline-block; margin-bottom: 20px; font-size: 14px; font-weight: bold;">🎉 SPECIAL OFFER</div>
            <h1 style="margin: 0; font-size: 36px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${templateData.heading}</h1>
            <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.95;">${templateData.subheading}</p>
          </header>
          
          <section style="${baseStyles.content}">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 28px;">Limited Time Offer!</h2>
              <p style="margin: 0; font-size: 18px; opacity: 0.9;">${templateData.content.mainText}</p>
            </div>
            
            <div style="display: flex; justify-content: space-around; margin: 30px 0; text-align: center;">
              ${templateData.content.features
                .slice(0, 3)
                .map(
                  (feature) => `
                <div style="flex: 1; padding: 20px; margin: 0 10px; background: #f8f9fa; border-radius: 8px;">
                  <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                  <p style="margin: 0; font-size: 14px; color: #666;">${feature}</p>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${templateData.buttonUrl}" style="display: inline-block; padding: 20px 40px; background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255,107,107,0.4);">${templateData.buttonText}</a>
            </div>
          </section>
          
          <footer style="${baseStyles.footer} background: #2c3e50; color: white;">
            <div style="margin-bottom: 15px;">
              <a href="${templateData.socialLinks.facebook}" style="${baseStyles.socialLink} background-color: #3b5998;">📘</a>
              <a href="${templateData.socialLinks.twitter}" style="${baseStyles.socialLink} background-color: #1da1f2;">🐦</a>
              <a href="${templateData.socialLinks.instagram}" style="${baseStyles.socialLink} background-color: #e4405f;">📷</a>
            </div>
            <p style="margin: 0; color: #bdc3c7;">${templateData.footerText}</p>
          </footer>
        </div>
      `,
      welcome: `
        <div style="${baseStyles.container}">
          <header style="background-color: ${templateData.primaryColor}; color: white; padding: 40px 20px; text-align: center;">
            <img src="${templateData.companyLogo}" alt="${templateData.companyName}" style="max-height: 60px; margin-bottom: 25px;">
            <h1 style="margin: 0; font-size: 30px;">👋 ${templateData.heading}</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">${templateData.subheading}</p>
          </header>
          
          <section style="${baseStyles.content}">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 24px;">Welcome to the family! 🎉</h2>
              <p style="margin: 0; opacity: 0.9;">${templateData.content.mainText}</p>
            </div>
            
            <h3 style="color: ${templateData.secondaryColor}; margin: 30px 0 20px 0;">Here's what happens next:</h3>
            <div style="margin: 25px 0;">
              ${templateData.content.features
                .map(
                  (feature, index) => `
                <div style="display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                  <div style="background: ${templateData.primaryColor}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">${index + 1}</div>
                  <p style="margin: 0; color: #666;">${feature}</p>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${templateData.buttonUrl}" style="${baseStyles.button}">${templateData.buttonText}</a>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 30px 0;">
              <p style="margin: 0; color: #155724;"><strong>Need help?</strong> We're here for you! Reply to this email or contact our support team.</p>
            </div>
          </section>
          
          <footer style="${baseStyles.footer}">
            <p style="margin: 0 0 15px 0;">Follow us for updates:</p>
            <div style="margin-bottom: 15px;">
              <a href="${templateData.socialLinks.facebook}" style="${baseStyles.socialLink} background-color: #3b5998;">Facebook</a>
              <a href="${templateData.socialLinks.twitter}" style="${baseStyles.socialLink} background-color: #1da1f2;">Twitter</a>
              <a href="${templateData.socialLinks.instagram}" style="${baseStyles.socialLink} background-color: #e4405f;">Instagram</a>
            </div>
            <p style="margin: 0; font-size: 11px; color: #999;">${templateData.footerText}</p>
          </footer>
        </div>
      `,
    }

    return templatesContent[currentTemplate as keyof typeof templatesContent] || templatesContent.modern
  }

  const saveTemplate = () => {
    if (!editorInstance.current) return

    try {
      const html = editorInstance.current.getHtml()
      const css = editorInstance.current.getCss()

      // Create HTML with inline CSS for email compatibility
      const inlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${templateData.heading} - ${templateData.companyName}</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Client-specific styles */
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        
        /* Outlook specific */
        table { border-collapse: collapse; }
        
        /* Custom styles */
        ${css}
        
        /* Mobile responsive */
        @media only screen and (max-width: 600px) {
            .mobile-center { text-align: center !important; }
            .mobile-full-width { width: 100% !important; }
            .mobile-padding { padding: 15px !important; }
            .mobile-font-size { font-size: 16px !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                ${html}
            </td>
        </tr>
    </table>
</body>
</html>`

      setSavedHtml(inlineHtml)

      // Show success message
      const event = new CustomEvent("template-saved", {
        detail: {
          html: inlineHtml,
          template: currentTemplate,
          data: templateData,
        },
      })
      window.dispatchEvent(event)

      alert("✅ Template saved successfully! HTML with inline CSS is ready for email services.")
    } catch (err) {
      console.error("Error saving template:", err)
      alert("❌ Error saving template. Please try again.")
    }
  }

  const downloadTemplate = () => {
    if (!savedHtml) {
      alert("Please save the template first")
      return
    }

    const blob = new Blob([savedHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentTemplate}-email-template-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!savedHtml) {
      alert("Please save the template first")
      return
    }

    try {
      await navigator.clipboard.writeText(savedHtml)
      alert("📋 HTML copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
      alert("Failed to copy to clipboard")
    }
  }

  // Add custom template creation from current editor content
  const saveAsCustomTemplate = () => {
    if (!editorInstance.current) return

    try {
      const html = editorInstance.current.getHtml()
      const css = editorInstance.current.getCss()

      const templateName = prompt("Enter a name for your custom template:")
      if (!templateName) return

      const templateDescription =
        prompt("Enter a description for your template:") || "Custom template created from editor"

      addCustomTemplate({
        name: templateName,
        description: templateDescription,
        category: "Custom",
        html: html,
        css: css,
      })

      alert("✅ Custom template saved successfully!")
    } catch (err) {
      console.error("Error saving custom template:", err)
      alert("❌ Error saving custom template. Please try again.")
    }
  }

  // Add this fallback editor component
  const FallbackEditor = () => {
    const [htmlContent, setHtmlContent] = useState("")
    const [cssContent, setCssContent] = useState("")

    const generateFallbackTemplate = () => {
      const template = generateTemplateContent()
      setHtmlContent(template)
    }

    useEffect(() => {
      generateFallbackTemplate()
    }, [templateData, currentTemplate])

    const saveFallbackTemplate = () => {
      const inlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.heading} - ${templateData.companyName}</title>
    <style>
        ${cssContent}
        /* Email client compatibility styles */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        table { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`

      setSavedHtml(inlineHtml)
      alert("✅ Template saved successfully!")
    }

    return (
      <div className="h-full flex flex-col">
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-sm font-medium">⚠️ Fallback Mode</span>
            <span className="text-xs">GrapesJS failed to load. Using simplified editor.</span>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="ml-auto">
              Try Reload
            </Button>
          </div>
        </div>

        <div className="bg-white border-b p-4 flex gap-2 items-center">
          <h2 className="text-lg font-semibold mr-4">Simple Template Editor</h2>
          <Button onClick={saveFallbackTemplate} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Template
          </Button>
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download HTML
          </Button>
          <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy HTML
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 p-4">
            <div className="h-full grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">HTML Content</Label>
                <Textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  placeholder="HTML content will appear here..."
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">CSS Styles</Label>
                <Textarea
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  placeholder="Add custom CSS styles here..."
                />
              </div>
            </div>
          </div>
          <div className="w-96 border-l bg-gray-50 p-4">
            <h3 className="font-medium mb-4">Preview</h3>
            <div className="border rounded bg-white p-4 h-96 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ fontSize: "12px", lineHeight: "1.4" }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Update the error display to include fallback option
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4 text-lg">{error}</div>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setError(null)
                setRetryCount((prev) => prev + 1)
                setLoadingStep("Retrying...")
                loadGrapesJS()
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setError(null)
                setIsLoaded(true) // This will show the fallback editor
              }}
            >
              Use Simple Editor
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Add this check before the main editor return
  if (isLoaded && !editorInstance.current && !error) {
    return <FallbackEditor />
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b p-4 flex gap-2 items-center flex-wrap">
        <h2 className="text-lg font-semibold mr-4">
          {templates.find((t) => t.id === currentTemplate)?.name || "Email Editor"}
        </h2>
        <Button onClick={saveTemplate} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Template
        </Button>
        <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download HTML
        </Button>
        <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copy HTML
        </Button>
        <Button onClick={() => setShowCode(!showCode)} variant="outline" className="flex items-center gap-2">
          {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showCode ? "Hide Code" : "Show Code"}
        </Button>
        <Button onClick={updateEditorContent} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Template
        </Button>
        <Button onClick={saveAsCustomTemplate} variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Save as Custom
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Blocks Panel */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Email Blocks</h3>
          <div id="blocks" className="space-y-2"></div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {!showCode ? (
            <div ref={editorRef} className="flex-1"></div>
          ) : (
            <div className="flex-1 p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Generated Email HTML with Inline CSS</CardTitle>
                  <p className="text-sm text-gray-600">
                    This HTML is optimized for email clients and includes inline CSS
                  </p>
                </CardHeader>
                <CardContent className="h-full">
                  <Textarea
                    value={savedHtml || "Save template first to see HTML code"}
                    readOnly
                    className="h-full font-mono text-sm resize-none"
                    placeholder="Your email HTML will appear here after saving..."
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-gray-50 border-l">
          <div className="flex border-b">
            <button
              className="flex-1 p-3 bg-white border-r hover:bg-gray-100 text-sm font-medium"
              onClick={() => {
                const layersEl = document.getElementById("layers")
                const stylesEl = document.getElementById("styles")
                if (layersEl && stylesEl) {
                  layersEl.style.display = "block"
                  stylesEl.style.display = "none"
                }
              }}
            >
              Layers
            </button>
            <button
              className="flex-1 p-3 bg-white hover:bg-gray-100 text-sm font-medium"
              onClick={() => {
                const layersEl = document.getElementById("layers")
                const stylesEl = document.getElementById("styles")
                if (layersEl && stylesEl) {
                  layersEl.style.display = "none"
                  stylesEl.style.display = "block"
                }
              }}
            >
              Styles
            </button>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <div id="layers"></div>
            <div id="styles" style={{ display: "none" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
