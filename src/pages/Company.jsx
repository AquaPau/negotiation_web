"use client"

import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"
import CreateContractorModal from "@/components/CreateContractorModal"
import CompanyDocumentUploadDialog from "@/components/CompanyDocumentUploadDialog"
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
import PeopleIcon from "@mui/icons-material/People"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

const Company = () => {
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [contractorsList, setContractorsList] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompanyDocumentUploadDialogOpen, setIsCompanyDocumentUploadDialogOpen] = useState(false)
  const [isCreateContractorModalOpen, setIsCreateContractorModalOpen] = useState(false)
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
    if (params.companyId) {
      fetchUserCompany()
    }
  }, [params.companyId])

  useEffect(() => {
    if (companyData) {
      fetchCompanyDocuments()
      fetchCompanyContractors()
    }
  }, [companyData])

  const fetchUserCompany = async () => {
    setIsLoading(true)
    try {
      const response = await api.getCompany(params.companyId)
      setCompanyData(response.data)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
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
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company documents:", error)
    }
  }

  const fetchCompanyContractors = async () => {
    try {
      const response = await api.getContractors(companyData.id)
      setContractorsList(response.data)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company contractor list:", error)
      setContractorsList([])
    }
  }

  const handleCreateContractor = async (contractorName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      await api.createContractor(params.companyId, {
        userId: user.id,
        customUserGeneratedName: contractorName,
        ogrn: ogrn,
        region: country,
      })
      setIsCreateContractorModalOpen(false)
      fetchCompanyContractors()
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to create contractor:", error)
    }
  }

  const handleViewContractorsDetails = (contractorId) => {
    if (companyData && companyData.id) {
      const url = `/company/${companyData.id}/contractor/${contractorId}`
      navigate(url)
    } else {
      setErrorMessage("Данные о компании отсутствуют")
      handleOpenSnack()
    }
  }

  const handleViewCompanyDocumentDetails = (documentId) => {
    if (companyData && companyData.id) {
      const url = `/company/${companyData.id}/document/${documentId}`
      navigate(url)
    } else {
      setErrorMessage("Данные о компании отсутствуют")
      handleOpenSnack()
    }
  }

  const handleDeleteCompanyConfirm = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCompany = async () => {
    try {
      await api.deleteCompany(companyData)
      setDeleteConfirmOpen(false)
      navigate(`/`)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to delete company:", error)
    }
  }

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsCompanyDocumentUploadDialogOpen(false)
    fetchCompanyDocuments()
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
        <Typography color="text.primary">{companyData?.customUserGeneratedName || "Компания"}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {companyData?.customUserGeneratedName}
          </Typography>
          {companyData?.residence && (
            <Chip
              label={defineCompanyResidence(companyData.residence)}
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
            onClick={handleDeleteCompanyConfirm}
            size="small"
          >
            Удалить компанию
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => setIsCompanyDocumentUploadDialogOpen(true)}
            size="small"
          >
            Загрузить документы
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateContractorModalOpen(true)}
            size="small"
          >
            Добавить контрагента
          </Button>
        </Box>
      </Box>

      {companyData ? ( <>
      {/* Company Details */}

            <Card sx={{ mb: 4}}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Информация о компании
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {companyData.fullName && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Полное наименование
                      </Typography>
                      <Typography variant="body1">{companyData.fullName}</Typography>
                    </Grid>
                  )}
                  <Grid container item xs={12} spacing={3}>
                    {companyData.inn && companyData.inn !== "null" && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          ИНН
                        </Typography>
                        <Typography variant="body1">{companyData.inn}</Typography>
                      </Grid>
                    )}
                    {companyData.ogrn && companyData.ogrn !== "null" && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          ОГРН
                        </Typography>
                        <Typography variant="body1">{companyData.ogrn}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  {(companyData.managerTitle || companyData.managerName) && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Исполнительный орган
                      </Typography>
                      <Typography variant="body1">
                        {companyData.managerTitle && companyData.managerName
                          ? `${companyData.managerTitle}: ${companyData.managerName}`
                          : companyData.managerTitle || companyData.managerName}
                      </Typography>
                    </Grid>
                  )}
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
                    onClick={() => setIsCompanyDocumentUploadDialogOpen(true)}
                  >
                    Добавить
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {documents.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Наименование</TableCell>
                        <TableCell>Тип</TableCell>
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
                              onClick={() => handleViewCompanyDocumentDetails(doc.id)}
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
                      onClick={() => setIsCompanyDocumentUploadDialogOpen(true)}
                      sx={{ mt: 2 }}
                    >
                      Загрузить документы
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

          {/* Contractors */}

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      Контрагенты
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<AddIcon />} onClick={() => setIsCreateContractorModalOpen(true)}>
                    Добавить
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {contractorsList.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell align="right">Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contractorsList.map((contractor) => (
                        <TableRow key={contractor.id} hover>
                          <TableCell>{contractor.customName}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewContractorsDetails(contractor.id)}
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
                    <Typography color="text.secondary">Контрагенты отсутствуют</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setIsCreateContractorModalOpen(true)}
                      sx={{ mt: 2 }}
                    >
                      Добавить контрагента
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

      </>) : (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Компания не найдена
            </Typography>
            <Button variant="contained" component={Link} href="/" sx={{ mt: 2 }}>
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CompanyDocumentUploadDialog
        isOpen={isCompanyDocumentUploadDialogOpen}
        onClose={() => setIsCompanyDocumentUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        companyId={companyData?.id}
      />

      <CreateContractorModal
        isOpen={isCreateContractorModalOpen}
        onClose={() => setIsCreateContractorModalOpen(false)}
        onCreateContractor={handleCreateContractor}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить компанию "{companyData?.customUserGeneratedName}"? Это действие нельзя будет
            отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteCompany} color="error" autoFocus>
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

export default Company
