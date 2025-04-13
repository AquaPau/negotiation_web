"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import Button from '@mui/material/Button';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CompanyDocumentUploadDialog from "@/components/CompanyDocumentUploadDialog"
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';import ContractorDocumentUploadDialog from "@/components/ContractorDocumentUploadDialog"
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


const Contractor = () => {
  const params = useParams()
  const [contractor, setContractor] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isContractorDocumentUploadDialogOpen, setIsContractorDocumentUploadDialogOpen] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const navigate = useNavigate()

  const [openSnack, setOpenSnack] = useState(false)
  const handleOpenSnack = () => {
    setOpenSnack(true);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const [errorMessage, setErrorMessage] = useState(null);

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
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch contractor details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContractor = async () => {
    try {
      await api.deleteContractor(params.companyId, params.contractorId)
      navigate(`/company/${params.companyId}`)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to delete company:", error)
    }
  }

  const fetchContractorDocuments = async () => {
    try {
      const response = await api.getContractorDocuments(params.companyId, params.contractorId)
      setDocuments(response.data)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company documents:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading contractor details...</div>
  }

  if (!contractor) {
    return <div className="text-center mt-8">Contractor not found</div>
  }

  const handleViewContractorDocumentDetails = (documentId) => {
    if (params.companyId && params.contractorId) {
      const url = `/company/${params.companyId}/contractor/${params.contractorId}/document/${documentId}`
      navigate(url)
    } else {
      console.error("Contractor data about document or ID is missing")
    }
  }

  const defineCompanyResidence = (code) => {
    const answer = code == "RU" ?  "Российская Федерация"
    : code == "KZ" ?  "Казахстан"
    : code == "BY" ? "Республика Беларусь"
    : "Другая"
    return answer
  }

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

  const handleUploadSuccess = (message) => {
    setUploadMessage(message)
    setIsContractorDocumentUploadDialogOpen(false)
    fetchContractorDocuments()
  }

  const handleUploadError = (message) => {
    setUploadMessage(message)
  }

  return (
    <div className="m-5 space-y-6">
      <Stack spacing={2} direction="row"  className="flex items-stretch justify-end">
        <Button
            variant="destructive"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary mr-10 ml-2"
            onClick={handleDeleteContractor}
        >
          Удалить контрагента
        </Button>
        <Button
            variant="contained"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary"
            onClick={() => setIsContractorDocumentUploadDialogOpen(true)}
        >
          Загрузить документы
        </Button>
      </Stack>
      <div>
        {contractor ? (
          <>
            <Paper className=" mb-10 w-lg">
              <Card className="w-lg">
                <CardHeader>
                  <Typography variant="h6" gutterBottom>
                    {contractor.customUserGeneratedName}
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex items-stretch justify-start">
                    <Typography variant="subtitle2" gutterBottom className="inline">
                      Страна регистрации: &nbsp;
                    </Typography>
                    <Typography variant="body2" gutterBottom className="inline">
                      {contractor.residence}
                    </Typography>
                  </div>

                  {contractor.fullName &&  <div className="flex items-stretch justify-start">
                    <Typography variant="subtitle2" gutterBottom className="inline">
                      Наименование: &nbsp;
                    </Typography>
                    <Typography variant="body2" gutterBottom className="inline">
                      {contractor.fullName}
                    </Typography>
                  </div>}
                  {contractor.inn && contractor.inn !== "null" &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ИНН: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {contractor.inn}
                        </Typography>
                      </div>}
                  {contractor.ogrn && contractor.ogrn !== "null" &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ОГРН: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {contractor.ogrn}
                        </Typography>
                      </div>}
                  {contractor.managerTitle &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          Исполнительный орган: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {contractor.managerTitle}
                        </Typography>
                      </div>}
                  {contractor.managerName &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ФИО исполнительного органа: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {contractor.managerName}
                        </Typography>
                      </div>}
                </CardContent>
              </Card>
            </Paper>

            <Container className="flex items-center justify-center w-full  mt-10">
              <Box className="w-full" xl={{ maxWidth: 1200 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Документы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Наименование</TableCell>
                          <TableCell>Тип документа</TableCell>
                          <TableCell>Детали</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.id}</TableCell>
                              <TableCell>{doc.name}</TableCell>
                              <TableCell>{defineDocTypeName(doc.type)}</TableCell>
                              <TableCell><Button variant="outlined" onClick={() => handleViewContractorDocumentDetails(doc.id)}>Данные документа</Button></TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Box>
            </Container>

          </>
        ) : (
            <Typography variant="h4">
              Контрагентов не найдено!
            </Typography>
        )}
        <ContractorDocumentUploadDialog
          isOpen={isContractorDocumentUploadDialogOpen}
          onClose={() => setIsContractorDocumentUploadDialogOpen(false)}
          onUploadSuccess={() => {
            handleUploadSuccess
            fetchContractorDocuments()
          }
          }
          onUploadError={handleUploadError}
          companyId={params.companyId}
          contractorId={contractor?.id}
        />

      </div>
      <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  )
}

export default Contractor