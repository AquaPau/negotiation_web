"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import CreateProjectModal from "@/components/CreateProjectModal"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Dashboard = () => {
  const [companyData, setCompanyData] = useState([])
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserCompanies()
    fetchUserProjects()
  }, [])

  const fetchUserCompanies = async () => {
    setIsLoading(true)
    try {
      const response = await api.getUserCompanies()
      setCompanyData(response.data)
    } catch (error) {
      console.error("Failed to fetch user company data:", error)
      setCompanyData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = async (companyName, ogrn, country) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createCompany({
        userId: user.id,
        customUserGeneratedName: companyName,
        ogrn: ogrn,
        region: country,
        isOwn: true,
      })
      setCompanyData(response.data)
      setIsCreateCompanyModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

  const handleViewCompany = (id) => {
    if (companyData.length > 0) {
      navigate(`/company/${id}`)
    }
  }
  const fetchUserProjects = async () => {
    setIsLoading(true)
    try {
      const response = await api.getUserProjects()
      setProjectData(response.data)
    } catch (error) {
      console.error("Failed to fetch user project data:", error)
      setProjectData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (projectName, userPrompt) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      const response = await api.createProject({
        userId: user.id,
        customUserGeneratedName: projectName,
        userGeneratedPrompt: userPrompt
      })
      setProjectData(response.data)
      setIsCreateProjectModalOpen(false)
    } catch (error) {
      console.error("Failed to create company:", error)
    }
  }

  const handleViewProject = (id) => {
    if (projectData.length > 0) {
      navigate(`/project/${id}`)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)]">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-stretch justify-end">
        <Button
            variant="contained"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary"
            onClick={() => setIsCreateCompanyModalOpen(true)}
        >
          Создать новую компанию
        </Button>
        <Button
            variant="contained"
            size="small"
            style={{ background: "#78909c" }}
            className="button-primary"
            onClick={() => setIsCreateProjectModalOpen(true)}
        >
          Создать новый проект
        </Button>
      </div>
      <Container className="flex items-center justify-center w-full  mt-10 mb-10">
        <Card>
          <CardHeader>
            <Typography variant="h2"  title=" Мои компании">
              Мои компании
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography variant="h3" className="mb-10"  title=" Мои компании">
              Мои компании
            </Typography>
            {companyData.length > 0 ? (
                <TableContainer component={Paper} className="mt-10">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyData.map((comp) => (
                          <TableRow key={comp.id} className="table-row">
                            <TableCell className="table-cell">{comp.id}</TableCell>
                            <TableCell className="table-cell">{comp.customUserGeneratedName}</TableCell>
                            <TableCell className="table-cell">
                              <Button className="outline" onClick={() => handleViewCompany(comp.id)}>Данные компании</Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }} className="text-center py-6 text-muted-foreground">
                  Нет доступных компаний. Создайте свою первую компанию.
                </Typography>
            )}
          </CardContent>
        </Card>
      </Container>


      <Container className="flex items-center justify-center w-full  mt-10">
        <Card>
          <CardHeader>
            <Typography variant="h2"  title=" Мои проекты">
              Мои проекты
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography variant="h3" className="mb-10"  title=" Мои проекты">
              Мои проекты
            </Typography>
            {projectData.length > 0 ? (
                <TableContainer component={Paper} className="mt-10">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectData.map((proj) => (
                          <TableRow key={proj.id} className="table-row">
                            <TableCell className="table-cell">{proj.id}</TableCell>
                            <TableCell className="table-cell">{proj.customUserGeneratedName}</TableCell>
                            <TableCell className="table-cell">
                              <Button className="outline" onClick={() => handleViewProject(proj.id)}>Данные проекта</Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }} className="text-center py-6 text-muted-foreground">
                  Нет доступных проектов. Создайте свой первый проект.
                </Typography>
            )}
          </CardContent>
        </Card>
      </Container>


      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={() => setIsCreateCompanyModalOpen(false)}
        onCreateCompany={handleCreateCompany}
      />
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}

export default Dashboard





