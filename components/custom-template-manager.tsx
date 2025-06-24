import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TemplateVariablesGuide } from "@/components/template-variables-guide"

export function CustomTemplateManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Custom Templates</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Create Template</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>Add a new custom template to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Template
                </Label>
                <Input id="email" value="" className="col-span-3" />
              </div>
            </div>
            <Button type="submit">Create Template</Button>
          </DialogContent>
        </Dialog>
      </div>

      <TemplateVariablesGuide />

      <Table>
        <TableCaption>A list of your custom templates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Template</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Template 1</TableCell>
            <TableCell>This is the first template</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Template 2</TableCell>
            <TableCell>This is the second template</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
