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
import DeleteIcon from "@mui/icons-material/Delete"
import WarningIcon from "@mui/icons-material/Warning"
import InfoIcon from "@mui/icons-material/Info"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import RefreshIcon from "@mui/icons-material/Refresh"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

const CompanyDocument = () => {
  const params = useParams()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const navigate = useNavigate()

  // Используем useRef вместо useState для хранения интервалов
  const descriptionPollingIntervalRef = useRef(null)

  // Добавляем useRef для предотвращения утечек памяти при размонтировании
  const isMounted = useRef(true)

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnack(false)
  }

  // Исправляем зависимости в useEffect, чтобы избежать повторного создания интервалов
  useEffect(() => {
    if (params.companyId && params.documentId) {
      fetchCompanyDocument()
    }

    // Добавляем эффект для очистки при размонтировании
    return () => {
      isMounted.current = false
      // Очищаем интервалы при размонтировании компонента
      if (descriptionPollingIntervalRef.current) clearInterval(descriptionPollingIntervalRef.current)
    }
  }, [params.companyId, params.documentId]) // Убираем лишние зависимости

  // Обновляем функцию fetchCompanyDocument для более надежного запуска опроса при загрузке
  const fetchCompanyDocument = async () => {
    setIsLoading(true)
    try {
      const response = await api.getCompanyDocument(params.companyId, params.documentId)
      setDoc(response.data)
      console.log("Fetched company document:", response.data)

      // Проверяем статус анализа содержания при загрузке страницы
      if (
        response.data?.description?.status &&
        response.data.description.status !== "FINISHED" &&
        response.data.description.status !== "FAILED"
      ) {
        console.log("Company document description analysis in progress, starting polling")
        // Если анализ содержания в процессе, запускаем опрос
        startDescriptionPolling()
      }
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Полностью переработанная функция startDescriptionPolling
  const startDescriptionPolling = () => {
    console.log("Starting company document description polling...")

    // Очищаем предыдущий интервал, если он существует
    if (descriptionPollingIntervalRef.current) {
      console.log("Clearing previous company description polling interval")
      clearInterval(descriptionPollingIntervalRef.current)
      descriptionPollingIntervalRef.current = null
    }

    // Создаем новый интервал с более простой логикой
    const intervalId = setInterval(() => {
      console.log("Company description polling interval triggered")

      // Выполняем запрос к API
      api
        .getCompanyDocument(params.companyId, params.documentId)
        .then((response) => {
          console.log("Company description polling received response:", response.data?.description?.status)

          // Обновляем данные документа
          setDoc(response.data)

          // Проверяем статус анализа
          if (response.data?.description?.status === "FINISHED" || response.data?.description?.status === "FAILED") {
            console.log("Company description analysis completed, stopping polling")
            clearInterval(intervalId)
            descriptionPollingIntervalRef.current = null
          }
        })
        .catch((error) => {
          console.error("Error in company description polling:", error)
        })
    }, 5000) // Опрашиваем каждые 5 секунд

    // Сохраняем идентификатор интервала
    descriptionPollingIntervalRef.current = intervalId

    // Выполняем первый запрос немедленно
    api
      .getCompanyDocument(params.companyId, params.documentId)
      .then((response) => {
        console.log("Initial company description polling response:", response.data?.description?.status)
        setDoc(response.data)
      })
      .catch((error) => {
        console.error("Error in initial company description polling:", error)
      })
  }

  // Обновляем функцию analyseDocumentDescription для более надежного запуска опроса
  const analyseDocumentDescription = async (docId, isRetry) => {
    try {
      console.log("Starting company document description analysis, isRetry:", isRetry)
      const response = await api.getDocumentDescription(docId, isRetry)
      console.log("Company analysis request response:", response)

      // Запускаем опрос статуса анализа содержания
      startDescriptionPolling()
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка анализа документа"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to analyze company document description:", error)
    }
  }

  const handleDeleteDocumentConfirm = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteDocument = async () => {
    try {
      await api.deleteCompanyDocument(params.companyId, params.documentId)
      setDeleteConfirmOpen(false)
      navigate(`/company/${params.companyId}`)
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка удаления документа"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to delete document:", error)
    }
  }

  // Проверка статуса задачи анализа содержимого
  const getDescriptionStatus = () => {
    if (!doc || !doc.description || !doc.description.status) {
      return null
    }
    return doc.description.status
  }

  // Обновляем функции для определения состояния загрузки:
  const isDescriptionLoading = () => {
    const status = getDescriptionStatus()
    return (status && status !== "FINISHED" && status !== "FAILED") || descriptionPollingIntervalRef.current !== null
  }

  // Определение, доступна ли кнопка обновления анализа содержимого
  const isDescriptionUpdateAvailable = () => {
    const status = getDescriptionStatus()
    return !status || status === "FINISHED" || status === "FAILED"
  }

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
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
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
        <Link color="inherit" href={`/company/${params.companyId}`} underline="hover">
          Компания
        </Link>
        <Typography color="text.primary">{doc?.name || "Документ"}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {doc?.name || "Документ не найден"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ID: {doc?.id}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteDocumentConfirm}
          size="small"
        >
          Удалить документ
        </Button>
      </Box>

      {doc ? (
        <Grid container spacing={4}>
          {/* Document Description */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      Содержимое документа
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {isDescriptionLoading() ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Анализ документа...</Typography>
                  </Box>
                ) : getDescriptionStatus() === "FINISHED" && doc.description && doc.description.text ? (
                  <Box>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                      <MarkdownRenderer>{doc.description.text}</MarkdownRenderer>
                    </Paper>
                    {doc.description && isDescriptionUpdateAvailable() && (
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => analyseDocumentDescription(doc.id, true)}
                        disabled={isDescriptionLoading()}
                      >
                        Обновить анализ
                      </Button>
                    )}
                  </Box>
                ) : getDescriptionStatus() === "FAILED" ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                    <Typography color="error" gutterBottom>
                      Произошла ошибка анализа содержимого документа, пожалуйста, попробуйте еще раз
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => analyseDocumentDescription(doc.id, true)}
                      disabled={isDescriptionLoading()}
                    >
                      Обновить анализ
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Анализ содержимого документа не выполнен
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => analyseDocumentDescription(doc.id, false)}
                      sx={{ mt: 2 }}
                    >
                      Выполнить анализ
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Документ не найден
            </Typography>
            <Button variant="contained" component={Link} href={`/company/${params.companyId}`} sx={{ mt: 2 }}>
              Вернуться к компании
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить документ "{doc?.name}"? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteDocument} color="error" autoFocus>
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

export default CompanyDocument

