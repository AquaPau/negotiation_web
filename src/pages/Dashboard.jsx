"use client"

import { useState, useEffect } from "react"
import { api } from "@/api/api"
import FileUpload from "@/components/FileUpload"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const [companyData, setCompanyData] = useState(null)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserCompany()
  }, [])

  const fetchUserCompany = async () => {
    setIsLoading(true)
    try {
      const response = await api.getCompanyData()
      setCompanyData(response.data)
    } catch (error) {
      console.error("Failed to fetch user company data:", error)
      setCompanyData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = async (companyName, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createCompany({
        userId: user.id,
        customUserGeneratedName: companyName,
        region: country,
        isOwn: true,
      })
      setCompanyData(response.data)
      setIsCreateCompanyModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

  const handleUpdateCompany = async () => {
    try {
      await api.updateCompany(companyData)
      await fetchUserCompany()
    } catch (error) {
      console.error("Failed to update company:", error)
    }
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setShowFileUpload(false)
    fetchUserCompany()
  }

  const handleUploadError = (message) => {
    setUploadMessage(message)
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-sidebar p-4">
        {companyData ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{companyData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Country: {companyData.country}</p>
                {companyData.inn && (
                  <>
                    <p>INN: {companyData.inn}</p>
                    <p>OGRN: {companyData.ogrn}</p>
                    <p>Address: {companyData.address}</p>
                    <p>CEO Position: {companyData.ceoPosition}</p>
                    <p>CEO Name: {companyData.ceoName}</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Button className="mt-4" onClick={handleUpdateCompany}>
              Update Company Data
            </Button>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadMessage && (
                  <p className={uploadMessage.includes("error") ? "text-red-500" : "text-green-500"}>{uploadMessage}</p>
                )}
                {showFileUpload ? (
                  <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
                ) : (
                  <Button onClick={() => setShowFileUpload(true)}>Upload Documents</Button>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Button onClick={() => setIsCreateCompanyModalOpen(true)}>Create Company</Button>
        )}
      </div>
      <div className="w-3/4 bg-background p-4">{/* Main content area */}</div>
      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={() => setIsCreateCompanyModalOpen(false)}
        onCreateCompany={handleCreateCompany}
      />
    </div>
  )
}

export default Dashboard



