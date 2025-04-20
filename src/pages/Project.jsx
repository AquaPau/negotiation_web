"use client"

import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Skeleton from "@mui/material/Skeleton"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import DeleteIcon from "@mui/icons-material/Delete"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import DescriptionIcon from "@mui/icons-material/Description"
import AssignmentIcon from "@mui/icons-material/Assignment"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import ProjectDocumentUploadDialog from "@/components/ProjectDocumentUploadDialog"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import AddIcon from "@mui/icons-material/Add"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

const Project = () => {
  const params = useParams()
  const [projectData, setProjectData] = useState(null)
  const [projectResult, setProjectResult] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResultLoading, setIsResultLoading] = useState(false)
  const [isProjectDocumentUploadDialogOpen, setIsProjectDocumentUploadDialogOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnack(false)
  }

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
      const response = await api.getProject(params.projectId)
      setProjectData(response.data)
      const result =
        response.data == null || response.data.taskResult == null || response.data.taskResult == undefined
          ? null
          : response.data.taskResult
      setProjectResult(result)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
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
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch project documents:", error)
    }
  }

  const analyseProject = async (isRetry) => {
    try {
      await api.getProjectResolution(params.projectId, isRetry)
      setIsResultLoading(true)
      // Fetch updated project after 3 seconds and 1 minute
      setTimeout(() => {
        fetchUserProject()
      }, 3000)
      setTimeout(() => {
        fetchUserProject()
        setIsResultLoading(false)
      }, 60000)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      setIsResultLoading(false)
      console.log("Failed to catch the project analysis: " + params.projectId)
    }
  }

  const handleDeleteProjectConfirm = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(projectData.id)
      setDeleteConfirmOpen(false)
      navigate(`/`)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to delete project:", error)
    }
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsProjectDocumentUploadDialogOpen(false)
    fetchProjectDocuments()
  }

  const handleUploadError = (message) => {
    setErrorMessage(message)
    handleOpenSnack()
  }

  const defineDocTypeName = (name) => {
    const types = {
      LABOR_CONTRACT: "Трудовой договор",
      REAL_ESTATE_LEASE_CONTRACT: "Договор аренды недвижимости",
      SALES_CONTRACT: "Договор купли-продажи",
      REAL_ESTATE_SALES_CONTRACT: "Договор купли-продажи недвижимости",
      SERVICE_CONTRACT: "Договор услуг/работ",
      LICENSE_CONTRACT: "Лицензионный договор",
    }
    return types[name] || "Другое"
  }

  // Определяем, нужно ли отображать описание и документы в одну строку
  const shouldDisplayInRow = documents.length > 0 && documents.length <= 3 && !isMobile

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Главная
        </Link>
        <Typography color="text.primary">{projectData?.customUserGeneratedName || "Проект"}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box sx={{ maxWidth: "70%" }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {projectData?.customUserGeneratedName || "Проект не найден"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ID: {projectData?.id}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteProjectConfirm}
            size="small"
          >
            Удалить проект
          </Button>

          {/* Кнопка анализа проекта */}
          {documents.length > 0 && (
            <Button
              variant={projectResult ? "outlined" : "contained"}
              color="primary"
              startIcon={isResultLoading ? <CircularProgress size={16} /> : <AnalyticsIcon />}
              onClick={() => analyseProject(projectResult ? true : false)}
              disabled={isResultLoading}
              size="small"
            >
              {isResultLoading ? "Анализ..." : projectResult ? "Повторить анализ" : "Проанализировать проект"}
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setIsProjectDocumentUploadDialogOpen(true)}
            size="small"
          >
            Загрузить документы
          </Button>
        </Box>
      </Box>

      {projectData ? (
        <>
          {/* Project Description */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Описание ситуации
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {projectData.userGeneratedPrompt}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

            {/* Documents */}

              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="h6" component="h2" fontWeight={600}>
                        Документы
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setIsProjectDocumentUploadDialogOpen(true)}
                    >
                      Добавить
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {documents.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Наименование</TableCell>
                          <TableCell>Тип документа</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc.id} hover>
                            <TableCell>{doc.id}</TableCell>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>{defineDocTypeName(doc.type)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Документы отсутствуют</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsProjectDocumentUploadDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Загрузить документы
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>


          {/* Динамическое отображение описания и документов */}
          <Grid container spacing={4}>
            {/* Project Analysis Results */}
            <Grid item xs={12} md={shouldDisplayInRow ? 6 : 12}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="h6" component="h2" fontWeight={600}>
                        Результаты анализа проекта
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {isResultLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography>Происходит анализ проекта...</Typography>
                    </Box>
                  ) : projectResult ? (
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                      <MarkdownRenderer>{projectResult}</MarkdownRenderer>
                    </Paper>
                  ) : documents.length > 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary" gutterBottom>
                        Анализ проекта не выполнен
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => analyseProject(false)}
                        sx={{ mt: 2 }}
                        disabled={isResultLoading}
                      >
                        Проанализировать проект
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">
                        Для анализа проекта требуется загрузить как минимум один документ
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsProjectDocumentUploadDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Загрузить документы
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>


          </Grid>
        </>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Проект не найден
            </Typography>
            <Button variant="contained" component={Link} href="/" sx={{ mt: 2 }}>
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ProjectDocumentUploadDialog
        isOpen={isProjectDocumentUploadDialogOpen}
        onClose={() => setIsProjectDocumentUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        projectId={projectData?.id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить проект "{projectData?.customUserGeneratedName}"? Это действие нельзя будет
            отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteProject} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Project
