"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CreateContractorModal = ({ isOpen, onClose, onCreateContractor }) => {
  const [customName, setCustomName] = useState("")
  const [ogrn, setOgrn] = useState("")
  const [country, setCountry] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateContractor({ customName, ogrn, country })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contractor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Custom Contractor Name"
              required
            />
          </div>
          <div>
            <Input id="ogrn" value={ogrn} onChange={(e) => setOgrn(e.target.value)} placeholder="OGRN" required />
          </div>
          <div>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger>
                <SelectValue placeholder="Country of Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="russia">Russia</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="china">China</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Create Contractor</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateContractorModal

