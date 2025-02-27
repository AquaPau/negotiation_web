import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import CreateContractorModal from "@/components/CreateContractorModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CompanyDocumentUploadDialog from "@/components/CompanyDocumentUploadDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const Company = () => {

  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [contractorsList, setContractorsList] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompanyDocumentUploadDialogOpen, setIsCompanyDocumentUploadDialogOpen] = useState(false)
  const [isCreateContractorModalOpen, setIsCreateContractorModalOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const navigate = useNavigate()


  useEffect(() => {
    if (params.companyId) {
      fetchUserCompany()
    }
  }, [params.companyId])

  useEffect(() => {
    if (companyData) {
      fetchCompanyDocuments()
    }
  }, [companyData])

  useEffect(() => {
    if (companyData) {
      fetchCompanyContractors()
    }
  }, [companyData])

  const fetchUserCompany = async () => {
    setIsLoading(true)
    try {
      console.log(params)
      const response = await api.getCompany(params.companyId)
      console.log(response.data)
      setCompanyData(response.data)
    } catch (error) {
      console.error("Failed to fetch user company data:", error)
      setCompanyData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanyDocuments = async () => {
    try {
      const response = await api.getCompanyDocuments(companyData.id)
      setDocuments(response.data)
    } catch (error) {
      console.error("Failed to fetch company documents:", error)
    }
  }

  const fetchCompanyContractors = async () => {
    setIsLoading(true)
    try {
      const response = await api.getContractors(companyData.id)
      setContractorsList(response.data)
    } catch (error) {
      console.error("Failed to fetch company contractor list:", error)
      setContractorsList([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContractor = async (contractorName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createContractor(params.companyId, {
        userId: user.id,
        customUserGeneratedName: contractorName,
        ogrn: ogrn,
        region: country
      })
      setIsCreateContractorModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

    const analyseDocumentInsights = async (docId) => {
      try {
        api.getDocumentInsights(docId)
        // Fetch updated file list after 3 seconds and 2 minutes
        setTimeout(async () => {
          fetchCompanyDocuments()
        }, 3000)
        setTimeout(async () => {
          fetchCompanyDocuments()
        }, 60000)

      } catch (error) {
        console.log("Failed to catch the document insights: " + docId)
      }
    }

  const handleViewContractorsDetails = (contractorId) => {
    if (companyData && companyData.id) {
      const url = `/company/${companyData.id}/contractor/${contractorId}`
      console.log("Navigating to:", url)
      navigate(url)
    } else {
      console.error("Company data about contractor or ID is missing")
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
    setIsCompanyDocumentUploadDialogOpen(false)
    fetchCompanyDocuments()
  }

  const handleUploadError = (message) => {
    setUploadMessage(message)
  }

  if (isLoading) {
    return <div className="text-center mt-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
          <div className="flex items-stretch justify-end">
            <Button className="link bg-stone-300" onClick={handleUpdateCompany}>Обновить данные компании</Button>
            <Button className="link bg-stone-300" onClick={() => setIsCompanyDocumentUploadDialogOpen(true)}>Загрузить документы</Button>
            <Button className="link bg-stone-300" onClick={() => setIsCreateContractorModalOpen(true)}>Создать нового контрагента</Button>
          </div>
      <div flex items-center justify-between>
        {companyData ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{companyData.customUserGeneratedName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Страна регистрации: {companyData.residence}</p>
                {companyData.fullName && <p>Наименование: {companyData.fullName}</p>}
                {companyData.inn && companyData.inn !== "null" && <p>ИНН: {companyData.inn}</p>}
                {companyData.ogrn && companyData.ogrn !== "null" && <p>ОГРН: {companyData.ogrn}</p>}
                {companyData.managerTitle && <p>Исполнительный орган: {companyData.managerTitle}</p>}
                {companyData.managerName && <p>ФИО исполнительного органа: {companyData.managerName}</p>}
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
                        <TableCell>{doc.description || <Button className="outline" onClick={() => analyseDocumentInsights(doc.id)}>Узнать содержимое документа</Button>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Контрагенты</CardTitle>
              </CardHeader>
              <CardContent>
                {contractorsList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Пользовательское название контрагента</TableHead>
                        <TableHead>Детали</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractorsList.map((contr) => (
                        <TableRow key={contr.id}>
                          <TableCell>{contr.id}</TableCell>
                          <TableCell>{contr.customName}</TableCell>
                          <TableCell><Button className="outline" onClick={() => handleViewContractorsDetails(contr.id)}>Данные контрагента</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <CardHeader>
                    <CardTitle> Контрагентов не найдено </CardTitle>
                  </CardHeader>
                )
                }
              </CardContent>
            </Card>
          </>) : (
          <CardHeader>
            <CardTitle> Компания не найдена! </CardTitle>
          </CardHeader>)}
        <CompanyDocumentUploadDialog
          isOpen={isCompanyDocumentUploadDialogOpen}
          onClose={() => setIsCompanyDocumentUploadDialogOpen(false)}
          onUploadSuccess={() => {
            handleUploadSuccess
            fetchCompanyDocuments()
          }
          }
          onUploadError={handleUploadError}
          companyId={companyData?.id}
        />
      <CreateContractorModal
        isOpen={isCreateContractorModalOpen}
        onClose={() => setIsCreateContractorModalOpen(false)}
        onCreateContractor={handleCreateContractor}
      />
      </div>

    </div>
  );
};

export default Company