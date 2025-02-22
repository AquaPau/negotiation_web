"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countries = [
  { code: "RU", name: "Russia" },
  { code: "BY", name: "Belarus" },
  { code: "KZ", name: "Kazakhstan" }
]

const CreateCompanyModal = ({ isOpen, onClose, onCreateCompany }) => {
  const [companyName, setCompanyName] = useState("")
  const [ogrn, setOgrn] = useState("")
  const [country, setCountry] = useState("RU")


  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateCompany(companyName, ogrn, country)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую компанию</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Название компании
            </label>
            <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="ogrn" className="block text-sm font-medium text-gray-700">
              ОГРН
            </label>
            <Input id="ogrn" value={ogrn} onChange={(e) => setOgrn(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country of Origin
            </label>
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
          <DialogFooter>
            <Button type="submit">Create Company</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCompanyModal
