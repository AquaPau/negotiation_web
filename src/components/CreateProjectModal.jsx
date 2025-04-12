import { useState, useEffect } from "react"
import {DialogContent, DialogTitle, DialogActions, Modal} from "@mui/material"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  shadow: '6px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState("")
  const [userPrompt, setUserPrompt] = useState("")


  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateProject(projectName, userPrompt)
  }

  return (
      <Modal maxWidth="md" open={isOpen} onOpenChange={onClose}>
        <Box sx={{ ...style}}>
          <div className="flex justify-between">
            <DialogTitle>Создать новую компанию</DialogTitle>
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
        </Box>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
                id="projectName"
                required
                className="input-field w-full"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                label="Название проекта"
                variant="standard"
            />
          </div>
          <div>
            <TextField
                id="userPrompt"
                required
                className="input-field w-full"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                label="Описание проекта: какой стороной договора вы являетесь, описание ситуации и запрос"
                variant="standard"
            />
          </div>
          <DialogActions>
            <Button
                variant="contained"
                type="submit"
                className="button-primary"
            >
              Создать проект
            </Button>
            <Button
                variant="outlined"
                type="submit"
                onClick={onClose}
                className="button-primary"
            >
              Отменить
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Modal>
  )
}

export default CreateProjectModal