"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/api/api"

const ContractorDocumentUploadDialog = ({ isOpen, onClose, onUploadSuccess, onUploadError, companyId, contractorId }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      type: "CORPORATE",
    }))
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const handleTypeChange = (index, value) => {
    setSelectedFiles((prev) => prev.map((file, i) => (i === index ? { ...file, type: value } : file)))
  }

  const handleDelete = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    try {
      const files = selectedFiles.map((sf) => sf.file)
      const types = selectedFiles.map((sf) => sf.type)

      await api.uploadContractorDocuments(companyId, contractorId, files, types)
      onUploadSuccess("Files uploaded successfully!")

      // Fetch updated file list after 3 seconds
      setTimeout(async () => {
        try {
          const updatedFiles = await api.getContractorDocuments(companyId, contractorId)
          // Handle the updated file list (e.g., update state in parent component)
          console.log("Updated files:", updatedFiles)
        } catch (error) {
          console.error("Error fetching updated files:", error)
        }
      }, 3000)

      onClose()
    } catch (error) {
      onUploadError("Error uploading files: " + error.message)
    }
  }

  const handleAddMoreFiles = () => {
    fileInputRef.current.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Загрузить документы</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input type="file" multiple onChange={handleFileChange} className="hidden" ref={fileInputRef} />
          <Button onClick={handleAddMoreFiles}>{selectedFiles.length > 0 ? "Добавить еще" : "Выбрать файл"}</Button>
          {selectedFiles.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.file.name}</TableCell>
                    <TableCell>
                      <Select value={file.type} onValueChange={(value) => handleTypeChange(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Тип документа" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONTRACT">ДОГОВОР</SelectItem>
                          <SelectItem value="OTHER">ДРУГОЕ</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" onClick={() => handleDelete(index)}>
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
            Загрузить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ContractorDocumentUploadDialog

