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
import axios from "axios"

const CompanyDocument = () => {
  const params = useParams()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRiskAnalyzing, setIsRiskAnalyzing] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState({
    description: { inProgress: false, progress: 0 },
    risks: { inProgress: false, progress: 0 },
  })
  const pollingIntervalRef = useRef(null)
  const navigate = useNavigate()

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
    if (params.companyId && params.documentId) {
      fetchCompanyDocument()
    }

    return () => {
      // Очистка интервала при размонтировании компонента
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [params.companyId, params.documentId])

  // Функция для проверки статуса анализа
  const checkAnalysisStatus = async () => {
    try {
      const response = await axios.get("http://test-api.com/load", {
        params: { documentId: params.documentId },
      })

      if (response.data && response.data.status) {
        // Обновляем статус анализа
        setAnalysisStatus((prevStatus) => ({
          description: {
            inProgress: response.data.description?.inProgress || false,
            progress: response.data.description?.progress || 0,
          },
          risks: {
            inProgress: response.data.risks?.inProgress || false,
            progress: response.data.risks?.progress || 0,
          },
        }))

        // Если анализ завершен, обновляем документ
        if (
          (!response.data.description?.inProgress && analysisStatus.description.inProgress) ||
          (!response.data.risks?.inProgress && analysisStatus.risks.inProgress)
        ) {
          fetchCompanyDocument()
        }
      }
    } catch (error) {
      console.error("Failed to check analysis status:", error)
    }
  }

  useEffect(() => {
    // Запускаем проверку статуса каждые 5 секунд, если идет анализ
    if (isAnalyzing || isRiskAnalyzing) {
      pollingIntervalRef.current = setInterval(checkAnalysisStatus, 5000)
    } else if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [isAnalyzing, isRiskAnalyzing])

  const fetchCompanyDocument = async () => {
    setIsLoading(true)
    try {
      const response = await api.getCompanyDocument(params.companyId, params.documentId)
      setDoc(response.data)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const analyseDocumentDescription = async (docId, isRetry) => {
    setIsAnalyzing(true)
    setAnalysisStatus((prev) => ({
      ...prev,
      description: { inProgress: true, progress: 0 },
    }))

    try {
      await api.getDocumentDescription(docId, isRetry)
      // Запускаем проверку статуса
      checkAnalysisStatus()
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка анализа документа"
      setErrorMessage(message)
      handleOpenSnack()
      setIsAnalyzing(false)
      setAnalysisStatus((prev) => ({
        ...prev,
        description: { inProgress: false, progress: 0 },
      }))
      console.error("Failed to analyze document description:", error)
    }
  }

  const analyseDocumentRisks = async (docId, isRetry) => {
    setIsRiskAnalyzing(true)
    setAnalysisStatus((prev) => ({
      ...prev,
      risks: { inProgress: true, progress: 0 },
    }))

    try {
      await api.getDocumentRisks(docId, isRetry)
      // Запускаем проверку статуса
      checkAnalysisStatus()
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка анализа рисков"
      setErrorMessage(message)
      handleOpenSnack()
      setIsRiskAnalyzing(false)
      setAnalysisStatus((prev) => ({
        ...prev,
        risks: { inProgress: false, progress: 0 },
      }))
      console.error("Failed to analyze document risks:", error)
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
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Содержимое документа
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {isAnalyzing ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Анализ документа...</Typography>
                  </Box>
                ) : doc.description && doc.description.text ? (
                  <Box>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
                      <MarkdownRenderer>{doc.description.text}</MarkdownRenderer>
                    </Paper>
                    <Button
                      variant="outlined"
                      onClick={() => analyseDocumentDescription(doc.id, true)}
                      sx={{ mt: 2 }}
                      disabled={isAnalyzing}
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
                      disabled={isAnalyzing}
                    >
                      Выполнить анализ
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Document Risks */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WarningIcon sx={{ mr: 1, color: "warning.main" }} />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Риски документа
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {isRiskAnalyzing ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Анализ рисков...</Typography>
                  </Box>
                ) : doc.risks && doc.risks.text ? (
                  <Box>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
                      <MarkdownRenderer>{doc.risks.text}</MarkdownRenderer>
                    </Paper>
                    <Button
                      variant="outlined"
                      onClick={() => analyseDocumentRisks(doc.id, true)}
                      sx={{ mt: 2 }}
                      disabled={isRiskAnalyzing}
                    >
                      Обновить анализ рисков
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Анализ рисков документа не выполнен
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => analyseDocumentRisks(doc.id, false)}
                      sx={{ mt: 2 }}
                      disabled={isRiskAnalyzing}
                    >
                      Выполнить анализ рисков
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
