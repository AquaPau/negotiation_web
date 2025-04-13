import { useState, useEffect } from "react"
import { api } from "@/api/api"
import { useParams, useNavigate } from "react-router-dom"

import CreateContractorModal from "@/components/CreateContractorModal"
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
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Company = () => {

  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [contractorsList, setContractorsList] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompanyDocumentUploadDialogOpen, setIsCompanyDocumentUploadDialogOpen] = useState(false)
  const [isCreateContractorModalOpen, setIsCreateContractorModalOpen] = useState(false)
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
    if (params.companyId) {
      fetchUserCompany()
    }
  }, [params.companyId])

  useEffect(() => {
    if (companyData) {
      fetchCompanyDocuments()
    }
  }, [companyData])

  useEffect(() => {
    if (companyData) {
      fetchCompanyContractors()
    }
  }, [companyData])

  const fetchUserCompany = async () => {
    setIsLoading(true)
    try {
      console.log(params)
      const response = await api.getCompany(params.companyId)
      console.log(response.data)
      setCompanyData(response.data)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
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
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company documents:", error)
    }
  }

  const fetchCompanyContractors = async () => {
    setIsLoading(true)
    try {
      const response = await api.getContractors(companyData.id)
      setContractorsList(response.data)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to fetch company contractor list:", error)
      setContractorsList([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContractor = async (contractorName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createContractor(params.companyId, {
        userId: user.id,
        customUserGeneratedName: contractorName,
        ogrn: ogrn,
        region: country
      })
      setIsCreateContractorModalOpen(false)
      setTimeout(async () => {
        fetchCompanyContractors()
      }, 3000)
      setTimeout(async () => {
        fetchCompanyContractors()
      }, 120000)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to create company:", error)
    }
  }

    const analyseDocumentInsights = async (docId) => {
      try {
        api.getDocumentInsights(docId)
        // Fetch updated file list after 3 seconds and 2 minutes
        setTimeout(async () => {
          fetchCompanyDocuments()
        }, 3000)
        setTimeout(async () => {
          fetchCompanyDocuments()
        }, 60000)

      } catch (error) {
        const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
        setErrorMessage(message)
        handleOpenSnack()
        console.log("Failed to catch the document insights: " + docId)
      }
    }

  const handleViewContractorsDetails = (contractorId) => {
    if (companyData && companyData.id) {
      const url = `/company/${companyData.id}/contractor/${contractorId}`
      navigate(url)
    } else {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Company data about contractor or ID is missing")
    }
  }

  const handleViewCompanyDocumentDetails = (documentId) => {
    if (companyData && companyData.id) {
      const url = `/company/${companyData.id}/document/${documentId}`
      navigate(url)
    } else {
      console.error("Company data about document or ID is missing")
    }
  }

  const handleDeleteCompany = async () => {
    try {
      await api.deleteCompany(companyData)
      navigate(`/`)
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
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

  const handleUploadError = (message) => {
    setUploadMessage(message)
  }

  if (isLoading) {
    return <div className="text-center mt-8">Загрузка...</div>
  }

  return (
    <div className="m-5 space-y-6">
      <Stack spacing={2} direction="row"  className="flex items-stretch justify-end">
        <Button
            variant="destructive"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary mr-10 ml-2"
            onClick={handleDeleteCompany}
        >
          Удалить компанию
        </Button>
        <Button
            variant="contained"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary"
            onClick={() => setIsCompanyDocumentUploadDialogOpen(true)}
        >
          Загрузить документы
        </Button>
        <Button
            variant="contained"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary"
            onClick={() => setIsCreateContractorModalOpen(true)}
        >
          Создать нового контрагента
        </Button>
      </Stack>
      <div>
        {companyData ? (
          <>
            <Paper className=" mb-10 w-lg">
              <Card className="w-lg">
                <CardHeader>
                  <Typography variant="h6" gutterBottom>
                    {companyData.customUserGeneratedName}
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex items-stretch justify-start">
                    <Typography variant="subtitle2" gutterBottom className="inline">
                      Страна регистрации: &nbsp;
                    </Typography>
                    <Typography variant="body2" gutterBottom className="inline">
                      {companyData.residence}
                    </Typography>
                  </div>

                  {companyData.fullName &&  <div className="flex items-stretch justify-start">
                    <Typography variant="subtitle2" gutterBottom className="inline">
                      Наименование: &nbsp;
                    </Typography>
                    <Typography variant="body2" gutterBottom className="inline">
                      {companyData.fullName}
                    </Typography>
                  </div>}
                  {companyData.inn && companyData.inn !== "null" &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ИНН: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {companyData.inn}
                        </Typography>
                      </div>}
                  {companyData.ogrn && companyData.ogrn !== "null" &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ОГРН: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {companyData.ogrn}
                        </Typography>
                      </div>}
                  {companyData.managerTitle &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          Исполнительный орган: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {companyData.managerTitle}
                        </Typography>
                      </div>}
                  {companyData.managerName &&
                      <div className="flex items-stretch justify-start">
                        <Typography variant="subtitle2" gutterBottom className="inline">
                          ФИО исполнительного органа: &nbsp;
                        </Typography>
                        <Typography variant="body2" gutterBottom className="inline">
                          {companyData.managerName}
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
                          <TableCell>Детали</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.id}</TableCell>
                              <TableCell>{doc.name}</TableCell>
                              <TableCell>{defineDocTypeName(doc.type)}</TableCell>
                              <TableCell><Button variant="outlined" onClick={() => handleViewCompanyDocumentDetails(doc.id)}>Данные документа</Button></TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Box>
            </Container>


            <Container className="flex items-center justify-center w-full  mt-10">
              <Box className="w-full" xl={{ maxWidth: 1200 }}>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Контрагенты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contractorsList.length > 0 ? (
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>Пользовательское название контрагента</TableCell>
                              <TableCell>Детали</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {contractorsList.map((contr) => (
                                <TableRow key={contr.id}>
                                  <TableCell>{contr.id}</TableCell>
                                  <TableCell>{contr.customName}</TableCell>
                                  <TableCell><Button className="outline" onClick={() => handleViewContractorsDetails(contr.id)}>Данные контрагента</Button></TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="h5">
                          Контрагентов не найдено
                        </Typography>
                      )
                    }
                  </CardContent>
                </Card>
              </Box>
            </Container>

          </>) : (
            <Typography variant="h4">
              Компания не найдена!
            </Typography>
          )}
        <CompanyDocumentUploadDialog
          isOpen={isCompanyDocumentUploadDialogOpen}
          onClose={() => setIsCompanyDocumentUploadDialogOpen(false)}
          onUploadSuccess={() => {
            handleUploadSuccess
            fetchCompanyDocuments()
          }
          }
          onUploadError={handleUploadError}
          companyId={companyData?.id}
        />
      <CreateContractorModal
        isOpen={isCreateContractorModalOpen}
        onClose={() => setIsCreateContractorModalOpen(false)}
        onCreateContractor={handleCreateContractor}
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
  );
};

export default Company