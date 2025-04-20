"use client"

import { useState } from "react"
import { DialogContent, DialogTitle, DialogActions, Dialog } from "@mui/material"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const CreateCompanyModal = ({ isOpen, onClose, onCreateCompany }) => {
  const [companyName, setCompanyName] = useState("")
  const [ogrn, setOgrn] = useState("")
  const [country, setCountry] = useState("RU")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateCompany(companyName, ogrn, country)
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
            Создать новую компанию
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            id="companyName"
            required
            fullWidth
            margin="normal"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            label="Название компании"
            variant="outlined"
            autoFocus
          />
          <TextField
            id="ogrn"
            required
            type="text"
            fullWidth
            margin="normal"
            value={ogrn}
            onChange={(e) => setOgrn(e.target.value)}
            label="ОГРН"
            variant="outlined"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="country-label">Страна регистрации</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              label="Страна регистрации"
            >
              <MenuItem value="RU">Российская Федерация</MenuItem>
              <MenuItem value="BY">Республика Беларусь</MenuItem>
              <MenuItem value="KZ">Казахстан</MenuItem>
            </Select>
          </FormControl>
          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button variant="outlined" onClick={onClose}>
              Отменить
            </Button>
            <Button variant="contained" type="submit">
              Создать компанию
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCompanyModal
