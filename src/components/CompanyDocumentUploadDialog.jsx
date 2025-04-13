"use client"

import { useState, useRef } from "react"
import {Dialog, DialogContent, DialogTitle, DialogActions} from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { api } from "@/api/api"
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CompanyDocumentUploadDialog = ({ isOpen, onClose, onUploadSuccess, onUploadError, companyId }) => {
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

      await api.uploadCompanyDocuments(companyId, files, types)
      onUploadSuccess("Files uploaded successfully!")

      // Fetch updated file list after 3 seconds
      setTimeout(async () => {
        try {
          const updatedFiles = await api.getCompanyDocuments(companyId)
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
    <Dialog fullWidth  maxWidth="md" open={isOpen} onOpenChange={onClose}>
        <div className="flex justify-between">
          <DialogTitle>Загрузить документы</DialogTitle>
          <IconButton
              aria-label="close"
              onClick={onClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <div className="grid gap-4 py-4">
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
              {selectedFiles.length > 0 ? "Добавить еще" : "Выбрать файл"}
              <VisuallyHiddenInput
                  ref={fileInputRef}
                  type="file"
                  id="files"
                  multiple
                  onChange={handleFileChange}
              />
            </Button>
            {selectedFiles.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="40%">Название</TableCell>
                      <TableCell width="30%">Тип</TableCell>
                      <TableCell>Действие</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedFiles.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell width="40%">{file.file.name}</TableCell>
                          <TableCell width="30%">
                            <FormControl variant="standard" className="input-field w-full">
                              <InputLabel id="" className="block text-sm font-medium text-gray-700">Тип документа</InputLabel>
                              <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={file.type}
                                  onChange={(evt) => handleTypeChange(index, evt.target.value)}
                                  label="Тип документа"
                              >
                                <MenuItem value="LABOR_CONTRACT">ТРУДОВОЙ ДОГОВОР</MenuItem>
                                <MenuItem value="REAL_ESTATE_LEASE_CONTRACT">ДОГОВОР АРЕНДЫ НЕДВИЖИМОСТИ</MenuItem>
                                <MenuItem value="SALES_CONTRACT">ДОГОВОР КУПЛИ-ПРОДАЖИ</MenuItem>
                                <MenuItem value="REAL_ESTATE_SALES_CONTRACT">ДОГОВОР КУПЛИ-ПРОДАЖИ НЕДВИЖИМОСТИ</MenuItem>
                                <MenuItem value="SERVICE_CONTRACT">ДОГОВОР УСЛУГ/РАБОТ</MenuItem>
                                <MenuItem value="LICENSE_CONTRACT">ЛИЦЕНЗИОННЫЙ ДОГОВОР</MenuItem>
                                <MenuItem value="DEFAULT">ДРУГОЕ</MenuItem>
                                <MenuItem value="CORPORATE">CORPORATE</MenuItem>
                              </Select>
                            </FormControl>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" className="button-primary" onClick={handleUpload} disabled={selectedFiles.length === 0}>
            Загрузить
          </Button>
        </DialogActions>

    </Dialog>
  )
}

export default CompanyDocumentUploadDialog

