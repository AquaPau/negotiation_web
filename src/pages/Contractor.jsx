"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Skeleton from "@mui/material/Skeleton"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import BusinessIcon from "@mui/icons-material/Business"
import DescriptionIcon from "@mui/icons-material/Description"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import ContractorDocumentUploadDialog from "@/components/ContractorDocumentUploadDialog"

const Contractor = () => {
  const params = useParams()
  const [contractor, setContractor] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isContractorDocumentUploadDialogOpen, setIsContractorDocumentUploadDialogOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
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
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
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
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch contractor documents:", error)
    }
  }

  const handleDeleteContractorConfirm = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteContractor = async () => {
    try {
      await api.deleteContractor(params.companyId, params.contractorId)
      setDeleteConfirmOpen(false)
      navigate(`/company/${params.companyId}`)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to delete contractor:", error)
    }
  }

  const handleViewContractorDocumentDetails = (documentId) => {
    if (params.companyId && params.contractorId) {
      const url = `/company/${params.companyId}/contractor/${params.contractorId}/document/${documentId}`
      navigate(url)
    } else {
      setErrorMessage("Данные о контрагенте отсутствуют")
      handleOpenSnack()
    }
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsContractorDocumentUploadDialogOpen(false)
    fetchContractorDocuments()
  }

  const handleUploadError = (message) => {
    setErrorMessage(message)
    handleOpenSnack()
  }

  const defineCompanyResidence = (code) => {
    return code === "RU"
      ? "Российская Федерация"
      : code === "KZ"
        ? "Казахстан"
        : code === "BY"
          ? "Республика Беларусь"
          : "Другая"
  }

  const defineDocTypeName = (name) => {
    const types = {
      LABOR_CONTRACT: "Трудовой договор",
      REAL_ESTATE_LEASE_CONTRACT: "Договор аренды недвижимости",
      SALES_CONTRACT: "Договор купли-продажи",
      REAL_ESTATE_SALES_CONTRACT: "Договор купли-продажи недвижимости",
      SERVICE_CONTRACT: "Договор услуг/работ",
      LICENSE_CONTRACT: "Лицензионный договор",
      LABOR_CONTRACT_EMPLOYER: "Трудовой договор (работодатель)",
      REAL_ESTATE_LEASE_CONTRACT_LANDLORD: "Договор аренды недвижимости (арендодатель)",
      REAL_ESTATE_LEASE_CONTRACT_TENANT: "Договор аренды недвижимости (арендатор)",
      SALES_CONTRACT_SELLER: "Договор купли-продажи (продавец)",
      SALES_CONTRACT_CUSTOMER: "Договор купли-продажи (покупатель)",
      REAL_ESTATE_SALES_CONTRACT_SELLER: "Договор купли-продажи недвижимости (продавец)",
      REAL_ESTATE_SALES_CONTRACT_CUSTOMER: "Договор купли-продажи недвижимости (покупатель)",
      SERVICE_CONTRACT_CONTRACTOR: "Договор услуг/работ (исполнитель)",
      SERVICE_CONTRACT_CUSTOMER: "Договор услуг/работ (заказчик)",
      LICENSE_CONTRACT_LICENSOR: "Лицензионный договор (лицензиар)",
      LICENSE_CONTRACT_LICENSEE: "Лицензионный договор (лицензиат)",
    }
    return types[name] || "Другое"
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
        <Link color="inherit" href={`/company/${params.companyId}`} underline="hover">
          Компания
        </Link>
        <Typography color="text.primary">{contractor?.customName || "Контрагент"}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box sx={{ maxWidth: "70%" }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {contractor?.customName || "Контрагент не найден"}
          </Typography>
          {contractor?.residence && (
            <Chip
              label={defineCompanyResidence(contractor.residence)}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteContractorConfirm}
            size="small"
          >
            Удалить контрагента
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setIsContractorDocumentUploadDialogOpen(true)}
            size="small"
          >
            Загрузить документы
          </Button>
        </Box>
      </Box>

      {contractor ? (<>

          {/* Contractor Details */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Информация о контрагенте
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Полное наименование
                    </Typography>
                    <Typography variant="body1">{contractor.fullName || "Не указано"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      ИНН
                    </Typography>
                    <Typography variant="body1">
                      {contractor.inn && contractor.inn !== "null" ? contractor.inn : "Не указан"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      ОГРН
                    </Typography>
                    <Typography variant="body1">
                      {contractor.ogrn && contractor.ogrn !== "null" ? contractor.ogrn : "Не указан"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Исполнительный орган
                    </Typography>
                    <Typography variant="body1">
                      {contractor.managerTitle && contractor.managerName
                        ? `${contractor.managerTitle}: ${contractor.managerName}`
                        : contractor.managerTitle || contractor.managerName || "Не указан"}
                    </Typography>
                  </Grid>
                </Grid>
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
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setIsContractorDocumentUploadDialogOpen(true)}
                  >
                    Добавить
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {documents.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Наименование</TableCell>
                        <TableCell>Тип документа</TableCell>
                        <TableCell align="right">Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} hover>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{defineDocTypeName(doc.type)}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewContractorDocumentDetails(doc.id)}
                            >
                              Просмотр
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">Документы отсутствуют</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setIsContractorDocumentUploadDialogOpen(true)}
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
              Контрагент не найден
            </Typography>
            <Button variant="contained" component={Link} href={`/company/${params.companyId}`} sx={{ mt: 2 }}>
              Вернуться к компании
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ContractorDocumentUploadDialog
        isOpen={isContractorDocumentUploadDialogOpen}
        onClose={() => setIsContractorDocumentUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        companyId={params.companyId}
        contractorId={contractor?.id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить контрагента "{contractor?.customName}"? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteContractor} color="error" autoFocus>
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

export default Contractor
