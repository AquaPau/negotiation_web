"use client"

// Обновляем импорты, добавляя необходимые компоненты
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

const ContractorDocument = () => {
  const params = useParams()
  const [doc, setDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
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
    if (params.companyId && params.contractorId && params.documentId) {
      fetchContractorDocument()
    }
  }, [params.companyId, params.contractorId, params.documentId])

  const fetchContractorDocument = async () => {
    setIsLoading(true)
    try {
      const response = await api.getContractorDocument(params.companyId, params.contractorId, params.documentId)
      setDoc(response.data)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch contractor document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const analyseDocumentDescription = async (docId, isRetry) => {
    try {
      await api.getDocumentDescription(docId, isRetry)
      // После запуска анализа обновляем данные документа
      setTimeout(() => {
        fetchContractorDocument()
      }, 2000)
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка анализа документа"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to analyze document description:", error)
    }
  }

  const analyseDocumentRisks = async (docId, isRetry) => {
    try {
      await api.getDocumentRisks(docId, isRetry)
      // После запуска анализа обновляем данные документа
      setTimeout(() => {
        fetchContractorDocument()
      }, 2000)
    } catch (error) {
      const message = error?.response?.data ?? "Ошибка анализа рисков"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to analyze document risks:", error)
    }
  }

  const handleDeleteDocumentConfirm = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteDocument = async () => {
    try {
      await api.deleteContractorDocument(params.companyId, params.contractorId, params.documentId)
      setDeleteConfirmOpen(false)
      navigate(`/company/${params.companyId}/contractor/${params.contractorId}`)
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

  // Проверка статуса задачи анализа рисков
  const getRisksStatus = () => {
    if (!doc || !doc.risks || !doc.risks.status) {
      return null
    }
    return doc.risks.status
  }

  // Определение, нужно ли показывать лоадер для анализа содержимого
  const isDescriptionLoading = () => {
    const status = getDescriptionStatus()
    return status && status !== "FINISHED" && status !== "FAILED"
  }

  // Определение, нужно ли показывать лоадер для анализа рисков
  const isRisksLoading = () => {
    const status = getRisksStatus()
    return status && status !== "FINISHED" && status !== "FAILED"
  }

  // Определение, доступна ли кнопка обновления анализа содержимого
  const isDescriptionUpdateAvailable = () => {
    const status = getDescriptionStatus()
    return !status || status === "FINISHED" || status === "FAILED"
  }

  // Определение, доступна ли кнопка обновления анализа рисков
  const isRisksUpdateAvailable = () => {
    const status = getRisksStatus()
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
        <Link color="inherit" href={`/company/${params.companyId}/contractor/${params.contractorId}`} underline="hover">
          Контрагент
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

          {/* Document Risks */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WarningIcon sx={{ mr: 1, color: "warning.main" }} />
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      Риски документа
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {isRisksLoading() ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Анализ рисков...</Typography>
                  </Box>
                ) : getRisksStatus() === "FINISHED" && doc.risks && doc.risks.text ? (
                  <Box>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}>
                    <MarkdownRenderer>{doc.risks.text}</MarkdownRenderer>
                  </Paper>
                  {doc.risks && isRisksUpdateAvailable() && (
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => analyseDocumentRisks(doc.id, true)}
                      disabled={isRisksLoading()}
                    >
                      Обновить анализ
                    </Button>
                  )}
                  </Box>
                ) : getRisksStatus() === "FAILED" ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                    <Typography color="error" gutterBottom>
                      Произошла ошибка анализа рисков документа, пожалуйста, попробуйте еще раз
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => analyseDocumentRisks(doc.id, true)}
                      disabled={isRisksLoading()}
                    >
                      Обновить анализ
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Анализ рисков документа не выполнен
                    </Typography>
                    <Button variant="contained" onClick={() => analyseDocumentRisks(doc.id, false)} sx={{ mt: 2 }}>
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
            <Button
              variant="contained"
              component={Link}
              href={`/company/${params.companyId}/contractor/${params.contractorId}`}
              sx={{ mt: 2 }}
            >
              Вернуться к контрагенту
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

export default ContractorDocument

