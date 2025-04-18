import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectDocumentUploadDialog from "@/components/ProjectDocumentUploadDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const Project = () => {

  const params = useParams()
  const [projectData, setProjectData] = useState(null)
  const [projectResult, setProjectResult] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResultLoading, setIsResultLoading] = useState(false)
  const [isProjectDocumentUploadDialogOpen, setIsProjectDocumentUploadDialogOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const navigate = useNavigate()


  useEffect(() => {
    if (params.projectId) {
      fetchUserProject()
    }
  }, [params.projectId])

  useEffect(() => {
    if (projectData) {
      fetchProjectDocuments()
    }
  }, [projectData])

  const fetchUserProject = async () => {
    setIsLoading(true)
    try {
      console.log(params)
      const response = await api.getProject(params.projectId)
      console.log(response.data)
      setProjectData(response.data)
      const result = (response.data == null || response.data.taskResult == null || response.data.taskResult == undefined) ? null : response.data.taskResult
      setProjectResult(result)
    } catch (error) {
      console.error("Failed to fetch user project data:", error)
      setProjectData(null)
      setProjectResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjectDocuments = async () => {
    try {
      const response = await api.getProjectDocuments(projectData.id)
      setDocuments(response.data)
    } catch (error) {
      console.error("Failed to fetch project documents:", error)
    }
  }


  const analyseProject = async (isRetry) => {
    try {
      await api.getProjectResolution(params.projectId, isRetry)
      setIsResultLoading(true)
    } catch (error) {
      console.log("Failed to catch the project analysis: " + params.projectId)
    }
  }

  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(projectData)
      navigate(`/`)
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsProjectDocumentUploadDialogOpen(false)
    fetchProjectDocuments()
  }

  //todo scheduler to catch the analyse of the project

  const defineDocTypeName = (name) => {
    const answer = name == "LABOR_CONTRACT" ?  "Трудовой договор"
        : name == "REAL_ESTATE_LEASE_CONTRACT" ?  "Договор аренды недвижимости"
        : name == "SALES_CONTRACT" ? "Договор купли-продажи"
        : name == "REAL_ESTATE_SALES_CONTRACT" ? "Договор купли-продажи недвижимости"
        : name == "SERVICE_CONTRACT" ? "Договор услуг/работ"
        : name == "LICENSE_CONTRACT" ? "Лицензионный договор"
        : "Другое"
        return answer
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
            <Button className="link bg-stone-300" onClick={handleDeleteProject}>Удалить проект</Button>
            <Button className="link bg-stone-300" onClick={() => setIsProjectDocumentUploadDialogOpen(true)}>Загрузить документы</Button>
          </div>
      <div flex items-center justify-between>
        {projectData ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{projectData.customUserGeneratedName}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Описание ситуации</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{projectData.userGeneratedPrompt}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
               <CardTitle>Результаты анализа проекта</CardTitle>
              </CardHeader>
              <CardContent>
                {isResultLoading ? <div>Происходит анализ проекта...</div> : projectResult != null | undefined ? <div><p>{projectResult}</p><p><Button className="outline" onClick={() => analyseProject(true)}>Повторить анализ</Button></p></div> : documents.length > 0 ? <Button className="outline" onClick={() => analyseProject(false)}>Проанализировать проект</Button> : <div>Для анализа проекта требуется загрузить как минимум один документ</div>}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{defineDocTypeName(doc.type)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>) : (
          <CardHeader>
            <CardTitle> Проект не найден! </CardTitle>
          </CardHeader>)}
        <ProjectDocumentUploadDialog
          isOpen={isProjectDocumentUploadDialogOpen}
          onClose={() => setIsProjectDocumentUploadDialogOpen(false)}
          onUploadSuccess={() => {
            handleUploadSuccess
            fetchProjectDocuments()
          }
          }
          onUploadError={handleUploadError}
          projectId={projectData?.id}
        />
      </div>

    </div>
  );
};

export default Project