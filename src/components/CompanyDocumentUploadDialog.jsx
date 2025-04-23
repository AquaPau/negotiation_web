"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { api } from "@/api/api"
import { styled } from "@mui/material/styles"
import Select from "@mui/material/Select"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import DeleteIcon from "@mui/icons-material/Delete"
import Tooltip from "@mui/material/Tooltip"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const CompanyDocumentUploadDialog = ({ isOpen, onClose, onUploadSuccess, onUploadError, companyId }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      type: "DEFAULT",
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
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      const files = selectedFiles.map((sf) => sf.file)
      const types = selectedFiles.map((sf) => sf.type)

      await api.uploadCompanyDocuments(companyId, files, types)
      onUploadSuccess("Файлы успешно загружены!")

      // Fetch updated file list after 3 seconds
      setTimeout(async () => {
        try {
          const updatedFiles = await api.getCompanyDocuments(companyId)
          console.log("Updated files:", updatedFiles)
        } catch (error) {
          console.error("Error fetching updated files:", error)
        }
      }, 3000)

      onClose()
    } catch (error) {
      onUploadError("Ошибка загрузки файлов: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Загрузить документы компании
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
            disabled={uploading}
          >
            {selectedFiles.length > 0 ? "Добавить еще файлы" : "Выбрать файлы"}
            <VisuallyHiddenInput ref={fileInputRef} type="file" id="files" multiple onChange={handleFileChange} />
          </Button>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            К загрузке доступны расширения .doc, .docx, .txt, .pdf (не сканы)
          </Typography>

          {selectedFiles.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Выберите файлы для загрузки. К загрузке доступны расширения .doc, .docx, .txt, .pdf (не сканы)
            </Alert>
          )}

          {selectedFiles.length > 0 && (
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell width="50%">Название файла</TableCell>
                  <TableCell width="40%">Тип документа</TableCell>
                  <TableCell width="10%" align="center">
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.file.name}</TableCell>
                    <TableCell>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id={`document-type-label-${index}`}>Тип документа</InputLabel>
                        <Select
                          labelId={`document-type-label-${index}`}
                          id={`document-type-${index}`}
                          value={file.type}
                          onChange={(e) => handleTypeChange(index, e.target.value)}
                          label="Тип документа"
                        >
                          <MenuItem value="DEFAULT">Документы компании</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Удалить">
                        <IconButton color="error" size="small" onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={uploading}>
          Отменить
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          startIcon={uploading && <CloudUploadIcon />}
        >
          {uploading ? "Загрузка..." : "Загрузить"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompanyDocumentUploadDialog
