"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "@/api/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ContractorDocumentUploadDialog from "@/components/ContractorDocumentUploadDialog"


const Contractor = () => {
  const params = useParams()
  const [contractor, setContractor] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isContractorDocumentUploadDialogOpen, setIsContractorDocumentUploadDialogOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")

  useEffect(() => {
    if (params.companyId && params.contractorId) {
      fetchContractorDetails()
      fetchContractorDocuments()
    }
  }, [params.companyId, params.contractorId])

  const fetchContractorDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.getContractor(params.companyId, params.contractorId)
      setContractor(response.data)
    } catch (error) {
      console.error("Failed to fetch contractor details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchContractorDocuments = async () => {
    try {
      const response = await api.getContractorDocuments(params.companyId, params.contractorId)
      setDocuments(response.data)
    } catch (error) {
      console.error("Failed to fetch company documents:", error)
    }
  }

  const analyseDocumentInsights = async (docId) => {
    try {
      api.getDocumentInsights(docId)
      // Fetch updated file list after 3 seconds
      setTimeout(async () => {
          fetchContractorDocuments()
      }, 3000)
      
    } catch (error) {
      console.log("Failed to catch the document insights: " + docId)
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading contractor details...</div>
  }

  if (!contractor) {
    return <div className="text-center mt-8">Contractor not found</div>
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsContractorDocumentUploadDialogOpen(false)
    fetchContractorDocuments()
  }

  const handleUploadError = (message) => {
    setUploadMessage(message)
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-sidebar p-4">
        {contractor ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{contractor.customUserGeneratedName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Страна регистрации: {contractor.residence}</p>
                {contractor.fullName && <p>Наименование: {contractor.fullName}</p>}
                {contractor.inn && contractor.inn !== "null" && <p>ИНН: {contractor.inn}</p>}
                {contractor.ogrn && contractor.ogrn !== "null" && <p>ОГРН: {contractor.ogrn}</p>}
                {contractor.managerTitle && <p>Исполнительный орган: {contractor.managerTitle}</p>}
                {contractor.managerName && <p>ФИО исполнительного органа: {contractor.managerName}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Документы</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Наименование</TableHead>
                      <TableHead>Описание содержания</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.description || <Button onClick={() => analyseDocumentInsights(doc.id)}>Узнать содержимое документа</Button>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardContent>
                {uploadMessage && (
                  <p className={uploadMessage.includes("error") ? "text-red-500" : "text-green-500"}>{uploadMessage}</p>
                )}
                <Button onClick={() => setIsContractorDocumentUploadDialogOpen(true)}>Загрузить документы</Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card><CardHeader>
            <CardTitle> Компания не найдена! </CardTitle>
          </CardHeader></Card>
        )}
        <ContractorDocumentUploadDialog
          isOpen={isContractorDocumentUploadDialogOpen}
          onClose={() => setIsContractorDocumentUploadDialogOpen(false)}
          onUploadSuccess={() => {
            handleUploadSuccess
            fetchContractorDocuments()
          }
          }
          onUploadError={handleUploadError}
          companyId={params.companyId}
          contractorId={contractor?.id}
        />
      </div>
    </div>
  )
}

export default Contractor