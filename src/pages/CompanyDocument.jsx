import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import CreateContractorModal from "@/components/CreateContractorModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CompanyDocumentUploadDialog from "@/components/CompanyDocumentUploadDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const CompanyDocument = () => {

  const params = useParams()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    if (params.companyId && params.documentId) {
      fetchCompanyDocument()
    }
  }, [params.companyId, params.documentId])

  const fetchCompanyDocument = async () => {
    setIsLoading(true)
    try {
      const response = await api.getCompanyDocument(params.companyId, params.documentId)
      setDoc(response.data)
    } catch (error) {
      console.error("Failed to fetch company document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const analyseDocumentDescription = async (docId, isRetry) => {
    try {
      api.getDocumentDescription(docId, isRetry)
      // Fetch updated file list after 3 seconds and 2 minutes
      setTimeout(async () => {
        fetchCompanyDocument()
      }, 3000)
      setTimeout(async () => {
        fetchCompanyDocument()
      }, 60000)

    } catch (error) {
      console.log("Failed to catch the document description: " + docId)
    }
  }

  const analyseDocumentRisks = async (docId, isRetry) => {
    try {
      api.getDocumentRisks(docId, isRetry)
      // Fetch updated file list after 3 seconds and 2 minutes
      setTimeout(async () => {
        fetchCompanyDocument()
      }, 3000)
      setTimeout(async () => {
         fetchCompanyDocument()
      }, 60000)

    } catch (error) {
      console.log("Failed to catch the document insights: " + docId)
    }
  }

  const handleDeleteDocument = async () => {
    try {
      await api.deleteCompanyDocument(params.companyId, params.documentId)
      navigate(`/company/${companyId}`)
    } catch (error) {
      console.error("Failed to delete company:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
          <div className="flex items-stretch justify-end">
            <Button className="link bg-stone-300" onClick={handleDeleteDocument}>Удалить документ</Button>
          </div>
      <div flex items-center justify-between>
        {doc ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{doc.name}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
               <CardHeader>
                 <CardTitle>Содержимое документа</CardTitle>
               </CardHeader>
               <CardContent>
                 {(doc.description != null && doc.description.text) || <Button className="outline" onClick={() => analyseDocumentDescription(doc.id, false)}>Узнать</Button>}
               </CardContent>
               <CardContent>
                 {(doc.description != null && doc.description.text) && <Button className="outline" onClick={() => analyseDocumentDescription(doc.id, true)}>Обновить инфо</Button>}
               </CardContent>
             </Card>
             <Card>
               <CardHeader>
                 <CardTitle>Риски документа</CardTitle>
               </CardHeader>
               <CardContent>
                 {(doc.risks != null && doc.risks.text) || <Button className="outline" onClick={() => analyseDocumentRisks(doc.id, false)}>Узнать</Button>}
               </CardContent>
               <CardContent>
                 {(doc.risks != null && doc.risks.text) && <Button className="outline" onClick={() => analyseDocumentRisks(doc.id, true)}>Обновить инфо</Button>}
               </CardContent>
            </Card>

          </>) : (
          <CardHeader>
            <CardTitle> Документ не найден! </CardTitle>
          </CardHeader>)}

      </div>

    </div>
  );
};

export default CompanyDocument