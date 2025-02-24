"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

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

  const handleViewCompany = (id) => {
    if (companyData.length > 0) {
      navigate(`/company/${id}`)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)]">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-stretch justify-end">
        <Button className="link bg-stone-300" onClick={() => setIsCreateCompanyModalOpen(true)}>Создать новую компанию</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мои компании</CardTitle>
        </CardHeader>
        <CardContent>
          {companyData.length > 0 ? (
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyData.map((comp) => (
                    <TableRow key={comp.id} className="table-row">
                      <TableCell className="table-cell">{comp.id}</TableCell>
                      <TableCell className="table-cell">{comp.customUserGeneratedName}</TableCell>
                      <TableCell className="table-cell">
                        <Button className="outline" onClick={() => handleViewCompany(comp.id)}>Данные компании</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Нет доступных компаний. Создайте свою первую компанию.
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={() => setIsCreateCompanyModalOpen(false)}
        onCreateCompany={handleCreateCompany}
      />
    </div>
  )
}

export default Dashboard





