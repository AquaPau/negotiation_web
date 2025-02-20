"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import CreateContractorModal from "@/components/CreateContractorModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Dashboard = () => {
  const [companyData, setCompanyData] = useState([])
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserCompanies()
  }, [])

  const fetchUserCompanies = async () => {
    setIsLoading(true)
    try {
      const response = await api.getUserCompanies()
      setCompanyData(response.data)
    } catch (error) {
      console.error("Failed to fetch user company data:", error)
      setCompanyData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = async (companyName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createCompany({
        userId: user.id,
        customUserGeneratedName: companyName,
        ogrn: ogrn,
        region: country,
        isOwn: true,
      })
      setCompanyData(response.data)
      setIsCreateCompanyModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

  const handleCreateContractor = async (contractorName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createContractor({
        userId: user.id,
        customUserGeneratedName: contractorName,
        companyId: companyData.id,
        ogrn: ogrn,
        region: country
      })
      setIsCreateContractorModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

  const handleViewCompany = (id) => {
    if (companyData.length > 0) {
      const url = `/company/${id}`
      console.log("Navigating to:", url)
      navigate(url)
    } else {
      console.error("Company data or ID is missing")
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-sidebar p-4">
        {companyData.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Мои компании</CardTitle>
              </CardHeader>
              <CardContent>
              <Table>
                    <TableBody>
                      {companyData.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell>{comp.id}</TableCell>
                          <TableCell>{comp.customUserGeneratedName}</TableCell>
                          <TableCell><Button onClick={() => handleViewCompany(comp.id)}>Данные компании</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
              
            </Card>
          </>
        ) : (
          <Button onClick={() => setIsCreateCompanyModalOpen(true)}>Создать новую компанию</Button>
        )}
      </div>
      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={() => setIsCreateCompanyModalOpen(false)}
        onCreateCompany={handleCreateCompany}
      />
    </div>
  )
}

export default Dashboard



