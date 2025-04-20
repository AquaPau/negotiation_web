"use client"

import { useState } from "react"
import {DialogContent, DialogTitle, DialogActions, Dialog} from "@mui/material"
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const countries = [
  { code: "RU", name: "Russia" },
  { code: "BY", name: "Belarus" },
  { code: "KZ", name: "Kazakhstan" }
]

const CreateContractorModal = ({ isOpen, onClose, onCreateContractor }) => {
  const [customName, setCustomName] = useState("")
  const [ogrn, setOgrn] = useState("")
  const [country, setCountry] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateContractor(customName, ogrn, country)
  }

  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onOpenChange={onClose}>
        <div className="flex justify-between">
          <DialogTitle>Создать контрагента</DialogTitle>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
                id="companyName"
                required
                className="input-field w-full"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                label="Пользовательское имя контрагента"
                variant="standard"
            />
          </div>
          <div>
            <TextField
                id="ogrn"
                required
                className="input-field w-full"
                value={ogrn}
                onChange={(e) => setOgrn(e.target.value)}
                label="ОГРН"
                variant="standard"
            />
          </div>
          <div>
            <FormControl variant="standard" className="input-field w-full">
              <InputLabel id="country-label" className="block text-sm font-medium text-gray-700">Страна регистрации</InputLabel>
              <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  label="Select a country"
              >
                <MenuItem value="RU">
                  Российская Федерация
                </MenuItem>
                <MenuItem value="BY">
                  Республика Беларусь
                </MenuItem>
                <MenuItem value="KZ">
                  Казахстан
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <DialogActions>
            <Button
                variant="contained"
                type="submit"
                className="button-primary"
            >
              Создать контрагента
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
    </Dialog>
  )
}

export default CreateContractorModal

