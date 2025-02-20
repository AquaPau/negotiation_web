"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый контрагент</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Пользовательское имя контрагента"
              required
            />
          </div>
          <div>
            <Input id="ogrn" value={ogrn} onChange={(e) => setOgrn(e.target.value)} placeholder="ОГРН" required />
          </div>
          <div>
            <Select value={country} onValueChange={setCountry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
          </div>
          <Button type="submit">Создать</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateContractorModal

