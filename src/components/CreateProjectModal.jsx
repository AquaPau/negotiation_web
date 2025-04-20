"use client"

import { useState } from "react"
import { DialogContent, DialogTitle, DialogActions, Dialog } from "@mui/material"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState("")
  const [userPrompt, setUserPrompt] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateProject(projectName, userPrompt)
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
            Создать новый проект
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            id="projectName"
            required
            fullWidth
            margin="normal"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            label="Название проекта"
            variant="outlined"
            autoFocus
          />
          <TextField
            id="userPrompt"
            required
            fullWidth
            margin="normal"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            label="Описание проекта"
            variant="outlined"
            multiline
            rows={4}
            helperText="Опишите какой стороной договора вы являетесь, ситуацию и ваш запрос"
          />
          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button variant="outlined" onClick={onClose}>
              Отменить
            </Button>
            <Button variant="contained" type="submit">
              Создать проект
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProjectModal
