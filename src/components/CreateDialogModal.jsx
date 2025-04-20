"use client"

import { useState } from "react"
import { DialogContent, DialogTitle, DialogActions, Dialog } from "@mui/material"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const CreateDialogModal = ({ isOpen, onClose, onCreateDialog }) => {
  const [dialogName, setDialogName] = useState("")
  const [dialogDescription, setDialogDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateDialog(dialogName, dialogDescription)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
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
            Создать новый диалог
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            id="dialogName"
            required
            fullWidth
            margin="normal"
            value={dialogName}
            onChange={(e) => setDialogName(e.target.value)}
            label="Название диалога"
            variant="outlined"
            autoFocus
          />
          <TextField
            id="dialogDescription"
            required
            fullWidth
            margin="normal"
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
            label="Описание диалога"
            variant="outlined"
            multiline
            rows={4}
            helperText="Опишите тему диалога и его цель"
          />
          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button variant="outlined" onClick={onClose}>
              Отменить
            </Button>
            <Button variant="contained" type="submit">
              Создать диалог
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDialogModal
