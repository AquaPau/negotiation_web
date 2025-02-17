"use client"

import { useState, useEffect } from "react"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import FileUploadDialog from "@/components/FileUploadDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const [companyData, setCompanyData] = useState(null)
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false)
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
    setIsFileUploadDialogOpen(false)
    // Optionally, you can refresh the company data here to show the updated file list
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
                <CardTitle>{companyData.customUserGeneratedName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Country: {companyData.residence}</p>
                {companyData.inn && companyData.inn !== "null" && <p>INN: {companyData.inn}</p>}
                {companyData.ogrn && companyData.ogrn !== "null" && <p>OGRN: {companyData.ogrn}</p>}
                {companyData.fullName && <p>Full Name: {companyData.fullName}</p>}
                {companyData.managerName && <p>Manager Name: {companyData.managerName}</p>}
                {companyData.managerTitle && <p>Manager Title: {companyData.managerTitle}</p>}
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
                <Button onClick={() => setIsFileUploadDialogOpen(true)}>Upload Documents</Button>
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
      <FileUploadDialog
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        companyId={companyData?.id}
      />
    </div>
  )
}

export default Dashboard

