"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "@/api/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Contractor = () => {
  const { contractorId } = useParams()
  const [contractor, setContractor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContractorDetails()
  }, [])

  const fetchContractorDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.getContractorDetails(contractorId)
      setContractor(response.data)
    } catch (error) {
      console.error("Failed to fetch contractor details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading contractor details...</div>
  }

  if (!contractor) {
    return <div className="text-center mt-8">Contractor not found</div>
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{contractor.customContractorName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ID: {contractor.id}</p>
          <p>Official Name: {contractor.officialName}</p>
          <p>OGRN: {contractor.ogrn}</p>
          <p>Country: {contractor.country}</p>
          {/* Add more contractor details as needed */}
        </CardContent>
      </Card>
    </div>
  )
}

export default Contractor