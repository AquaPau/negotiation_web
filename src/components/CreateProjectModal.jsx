import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState("")
  const [userPrompt, setUserPrompt] = useState("")


  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateProject(projectName, userPrompt)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый проект</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Название проекта
            </label>
            <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700">
              Описание проекта: какой стороной договора вы являетесь, описание ситуации и запрос
            </label>
            <Input id="userPrompt" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="submit">Создать проект</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProjectModal