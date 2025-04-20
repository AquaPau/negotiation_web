"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import CreateProjectModal from "@/components/CreateProjectModal"
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add"
import BusinessIcon from "@mui/icons-material/Business"
import FolderIcon from "@mui/icons-material/Folder"
import Skeleton from "@mui/material/Skeleton"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"

const Dashboard = () => {
  const [companyData, setCompanyData] = useState([])
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [menuAnchorElCompany, setMenuAnchorElCompany] = useState(null)
  const [selectedItemIdCompany, setSelectedItemIdCompany] = useState(null)
  const [menuAnchorElProject, setMenuAnchorElProject] = useState(null)
  const [selectedItemIdProject, setSelectedItemIdProject] = useState(null)

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnack(false)
  }

  const handleMenuOpenCompany = (event, id) => {
    setMenuAnchorElCompany(event.currentTarget)
    setSelectedItemIdCompany(id)
  }

  const handleMenuOpenProject = (event, id) => {
    setMenuAnchorElProject(event.currentTarget)
    setSelectedItemIdProject(id)
  }

  const handleMenuCloseCompany = () => {
    setMenuAnchorElCompany(null)
    setSelectedItemIdCompany(null)
  }

  const handleMenuCloseProject = () => {
    setMenuAnchorElProject(null)
    setSelectedItemIdProject(null)
  }

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
      fetchUserCompanies()
      setIsCreateCompanyModalOpen(false)
    } catch (error) {
      const message = error?.response?.data ?? "Неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to create company:", error)
    }
  }

  const handleViewCompany = (id) => {
    navigate(`/company/${id}`)
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
        userGeneratedPrompt: userPrompt,
      })
      fetchUserProjects()
      setIsCreateProjectModalOpen(false)
    } catch (error) {
      const message = error?.response?.data ?? "неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to create project:", error)
    }
  }

  const handleViewProject = (id) => {
    navigate(`/project/${id}`)
  }

  const renderSkeletons = () => (
    <Box sx={{ width: "100%" }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="rectangular" width="60%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="40%" height={20} />
          </CardContent>
        </Card>
      ))}
    </Box>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Мои компании
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateCompanyModalOpen(true)}
            >
            </Button>
          </Box>

          {isLoading ? (
            renderSkeletons()
          ) : companyData.length > 0 ? (
            <Box>
              {companyData.map((company) => (
                <Card key={company.id} sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleViewCompany(company.id)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                          {company.customUserGeneratedName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ОГРН: {company.ogrn || "Не указан"}
                        </Typography>
                        {company.residence && (
                          <Chip
                            label={company.residence === "RU" ? "Россия" : company.residence}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                      <Tooltip title="Подробнее">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMenuOpenCompany(e, company.id)
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{ textAlign: "center", py: 4 }}>
              <CardContent>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  У вас пока нет компаний
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsCreateCompanyModalOpen(true)}>
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FolderIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Мои проекты
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateProjectModalOpen(true)}
            >
            </Button>
          </Box>

          {isLoading ? (
            renderSkeletons()
          ) : projectData.length > 0 ? (
            <Box>
              {projectData.map((project) => (
                <Card key={project.id} sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleViewProject(project.id)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                          {project.customUserGeneratedName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.userGeneratedPrompt || "Нет описания"}
                        </Typography>
                      </Box>
                      <Tooltip title="Подробнее">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMenuOpenProject(e, project.id)
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{ textAlign: "center", py: 4 }}>
              <CardContent>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  У вас пока нет проектов
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsCreateProjectModalOpen(true)}>
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

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

      <Menu anchorEl={menuAnchorElCompany} open={Boolean(menuAnchorElCompany)} onClose={handleMenuCloseCompany}>
        <MenuItem
          onClick={() => {
            if (selectedItemIdCompany) {
              handleViewCompany(selectedItemIdCompany)
            }
            handleMenuCloseCompany()
          }}
        >
          Открыть
        </MenuItem>
      </Menu>
      <Menu anchorEl={menuAnchorElProject} open={Boolean(menuAnchorElProject)} onClose={handleMenuCloseProject}>
        <MenuItem
          onClick={() => {
            if (selectedItemIdProject) {
              handleViewProject(selectedItemIdProject)
            }
            handleMenuCloseProject()
          }}
        >
          Открыть
        </MenuItem>
      </Menu>

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert severity="error" onClose={handleCloseSnack}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Dashboard
