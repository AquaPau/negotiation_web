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
      // Fetch updated file list after 3 seconds and 2 minutes
      setTimeout(async () => {
        fetchContractorDocuments()
      }, 3000)
      setTimeout(async () => {
        fetchContractorDocuments()
      }, 120000)

    } catch (error) {
      console.log("Failed to catch the document insights: " + docId)
    }
  }

  const analyseDocumentRisks = async (docId) => {
    try {
      api.getDocumentRisks(docId)
      // Fetch updated file list after 3 seconds and 2 minutes
      setTimeout(async () => {
        fetchContractorDocuments()
      }, 3000)
      setTimeout(async () => {
        fetchContractorDocuments()
      }, 120000)
    } catch (error) {
      console.log("failed to catch document risks: " + docId)
    }
  }

  const analyseContractorOpportunities = async() => {
    try {
      api.getInteractionPossibilities(params.companyId, params.contractorId)
      // Fetch updated file list after 3 seconds and 2 minutes
      setTimeout(async () => {
        fetchContractorDetails()
      }, 3000)
      setTimeout(async () => {
        fetchContractorDetails()
      }, 120000)
    } catch (error) {
      console.log("failed to catch contractor opportunities: company - " + params.companyId + ", contractor - " + contractorId)
    }
  }

  const defineRisksCellData = (doc) => {
    if (doc.type != "CONTRACT") return "-"
    return doc.risks
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
//<Button className="link bg-stone-300" disabled={contractor.opportunities} onClick={() => analyseContractorOpportunities()}>Узнать возможности</Button>
  return (
    <div className="space-y-6">
              <div className="flex items-stretch justify-end">
                <Button className="link bg-stone-300" onClick={() => setIsContractorDocumentUploadDialogOpen(true)}>Загрузить документы</Button>
                <Button className="link bg-stone-300" disabled onClick={() => analyseContractorOpportunities()}>Узнать возможности</Button>
              </div>
      <div flex items-center justify-between>
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
                <CardTitle>Возможности сотрудничества с контрагентом</CardTitle>
              </CardHeader>
              <CardContent>
                {contractor.opportunities || "N/A"}
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
                      <TableHead>Тип документа</TableHead>
                      <TableHead>Описание содержания</TableHead>
                      <TableHead>Риски документа</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.description || <Button className="outline" onClick={() => analyseDocumentInsights(doc.id)}>Узнать содержимое документа</Button>}</TableCell>
                        <TableCell>{defineRisksCellData(doc) || <Button className="outline" onClick={() => analyseDocumentRisks(doc.id)}>Узнать риски договора</Button>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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