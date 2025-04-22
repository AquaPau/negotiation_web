"use client"

import { useState, useEffect, useRef } from "react"
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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import RefreshIcon from "@mui/icons-material/Refresh"

const Project = () => {
  const params = useParams()
  const [projectData, setProjectData] = useState(null)
  const [projectResult, setProjectResult] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Заменим useState для хранения интервала на useRef
  // Добавим useRef для хранения интервала опроса
  const resolutionPollingIntervalRef = useRef(null)
  // Добавим useRef для предотвращения утечек памяти при размонтировании
  const isMounted = useRef(true)

  // Заменим isResultLoading на более детальную логику
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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

  // Обновим useEffect для fetchUserProject, чтобы запускать опрос при загрузке
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

  // Добавим функцию startResolutionPolling для опроса статуса анализа проекта
  const startResolutionPolling = () => {
    console.log("Starting project resolution polling...")

    // Очищаем предыдущий интервал, если он существует
    if (resolutionPollingIntervalRef.current) {
      console.log("Clearing previous resolution polling interval")
      clearInterval(resolutionPollingIntervalRef.current)
      resolutionPollingIntervalRef.current = null
    }

    // Создаем новый интервал с более простой логикой
    const intervalId = setInterval(() => {
      console.log("Resolution polling interval triggered")

      // Выполняем запрос к API
      api
        .getProject(params.projectId)
        .then((response) => {
          console.log("Resolution polling received response:", response.data?.resolution?.status)

          // Обновляем данные проекта
          setProjectData(response.data)

          // Обновляем результат анализа
          const result =
            response.data == null || response.data.resolution == null || response.data.resolution.text == null
              ? null
              : response.data.resolution.text
          setProjectResult(result)

          // Проверяем статус анализа
          if (response.data?.resolution?.status === "FINISHED" || response.data?.resolution?.status === "FAILED") {
            console.log("Resolution analysis completed, stopping polling")
            clearInterval(intervalId)
            resolutionPollingIntervalRef.current = null
            setIsAnalyzing(false)
          }
        })
        .catch((error) => {
          console.error("Error in resolution polling:", error)
        })
    }, 5000) // Опрашиваем каждые 5 секунд

    // Сохраняем идентификатор интервала
    resolutionPollingIntervalRef.current = intervalId

    // Выполняем первый запрос немедленно
    api
      .getProject(params.projectId)
      .then((response) => {
        console.log("Initial resolution polling response:", response.data?.resolution?.status)
        setProjectData(response.data)
        const result =
          response.data == null || response.data.resolution == null || response.data.resolution.text == null
            ? null
            : response.data.resolution.text
        setProjectResult(result)
      })
      .catch((error) => {
        console.error("Error in initial resolution polling:", error)
      })
  }

  // Обновим функцию analyseProject для запуска опроса
  const analyseProject = async (isRetry) => {
    try {
      console.log("Starting project resolution analysis, isRetry:", isRetry)
      const response = await api.getProjectResolution(params.projectId, isRetry)
      console.log("Project analysis request response:", response)

      // Устанавливаем флаг анализа
      setIsAnalyzing(true)

      // Запускаем опрос статуса анализа
      startResolutionPolling()
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      setIsAnalyzing(false)
      console.log("Failed to catch the project analysis: " + params.projectId)
    }
  }

  // Добавим функцию для определения статуса анализа
  const getResolutionStatus = () => {
    if (!projectData || !projectData.resolution || !projectData.resolution.status) {
      return null
    }
    return projectData.resolution.status
  }

  // Добавим функцию для определения состояния загрузки
  const isResolutionLoading = () => {
    const status = getResolutionStatus()
    return (
      (status && status !== "FINISHED" && status !== "FAILED") ||
      resolutionPollingIntervalRef.current !== null ||
      isAnalyzing
    )
  }

  // Добавим функцию для определения доступности обновления
  const isResolutionUpdateAvailable = () => {
    const status = getResolutionStatus()
    return !status || status === "FINISHED" || status === "FAILED"
  }

  // Добавим эффект для очистки при размонтировании
  useEffect(() => {
    return () => {
      isMounted.current = false
      // Очищаем интервал при размонтировании компонента
      if (resolutionPollingIntervalRef.current) {
        clearInterval(resolutionPollingIntervalRef.current)
      }
    }
  }, [])

  // Обновим функцию fetchUserProject для запуска опроса при загрузке
  const fetchUserProject = async () => {
    setIsLoading(true)
    try {
      const response = await api.getProject(params.projectId)
      setProjectData(response.data)
      const result =
        response.data == null || response.data.resolution == null || response.data.resolution.text == null
          ? null
          : response.data.resolution.text
      setProjectResult(result)

      console.log("Fetched project:", response.data)

      // Проверяем статус анализа при загрузке страницы
      if (
        response.data?.resolution?.status &&
        response.data.resolution.status !== "FINISHED" &&
        response.data.resolution.status !== "FAILED"
      ) {
        console.log("Project resolution analysis in progress, starting polling")
        // Если анализ в процессе, запускаем опрос
        setIsAnalyzing(true)
        startResolutionPolling()
      }
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
              startIcon={isResolutionLoading() ? <CircularProgress size={16} /> : <AnalyticsIcon />}
              onClick={() => analyseProject(projectResult ? true : false)}
              disabled={isResolutionLoading()}
              size="small"
            >
              {isResolutionLoading() ? "Анализ..." : projectResult ? "Повторить анализ" : "Проанализировать проект"}
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

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Документы
                  </Typography>
                </Box>
                <Button size="small" startIcon={<AddIcon />} onClick={() => setIsProjectDocumentUploadDialogOpen(true)}>
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

          {/* Динамическое отображение описания */}
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

              {isResolutionLoading() ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography>Происходит анализ проекта...</Typography>
                </Box>
              ) : getResolutionStatus() === "FINISHED" && projectResult ? (
                <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                  <MarkdownRenderer>{projectResult}</MarkdownRenderer>
                </Paper>
              ) : getResolutionStatus() === "FAILED" ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                  <Typography color="error" gutterBottom>
                    Произошла ошибка анализа проекта, пожалуйста, попробуйте еще раз
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => analyseProject(true)}
                    disabled={isResolutionLoading()}
                  >
                    Повторить анализ
                  </Button>
                </Box>
              ) : documents.length > 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary" gutterBottom>
                    Анализ проекта не выполнен
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => analyseProject(false)}
                    sx={{ mt: 2 }}
                    disabled={isResolutionLoading()}
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
