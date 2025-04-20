"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
import CreateCompanyModal from "@/components/CreateCompanyModal"
import CreateProjectModal from "@/components/CreateProjectModal"
import CreateDialogModal from "@/components/CreateDialogModal"
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
import ChatIcon from "@mui/icons-material/Chat"
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
  const [dialogData, setDialogData] = useState([])
  const [isCreateDialogModalOpen, setIsCreateDialogModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedItemType, setSelectedItemType] = useState(null)

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnack(false)
  }

  const handleMenuOpen = (event, id, type) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
    setSelectedItemId(id)
    setSelectedItemType(type)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedItemId(null)
    setSelectedItemType(null)
  }

  useEffect(() => {
    fetchUserCompanies()
    fetchUserProjects()
    fetchUserDialogs()
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

  const fetchUserDialogs = async () => {
    setIsLoading(true)
    try {
      // Предполагаем, что API для диалогов уже существует
      const response = await api.getUserDialogs()
      setDialogData(response.data || []) // Если API еще не реализовано, используем пустой массив
    } catch (error) {
      console.error("Failed to fetch user dialog data:", error)
      setDialogData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDialog = async (dialogName, dialogDescription) => {
    try {
      const userResponse = await api.userData()
      const user = userResponse.data
      // Предполагаем, что API для создания диалогов уже существует
      const response = await api.createDialog({
        userId: user.id,
        name: dialogName,
        description: dialogDescription,
      })
      fetchUserDialogs()
      setIsCreateDialogModalOpen(false)
    } catch (error) {
      const message = error?.response?.data ?? "неизвестная ошибка, повторите запрос"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Failed to create dialog:", error)
    }
  }

  const handleViewDialog = (id) => {
    navigate(`/dialog/${id}`)
  }

  const handleMenuItemClick = () => {
    if (selectedItemType === "company") {
      handleViewCompany(selectedItemId)
    } else if (selectedItemType === "project") {
      handleViewProject(selectedItemId)
    } else if (selectedItemType === "dialog") {
      handleViewDialog(selectedItemId)
    }
    handleMenuClose()
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
        {/* Компании */}
        <Grid item xs={12} md={4}>
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
                            handleMenuOpen(e, company.id, "company")
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
                Создать первую компанию
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Проекты */}
        <Grid item xs={12} md={4}>
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
                            handleMenuOpen(e, project.id, "project")
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
                  Создать первый проект
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Диалоги */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ChatIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Мои диалоги
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disabled="true"
              onClick={() => setIsCreateDialogModalOpen(true)}
            >
            </Button>
          </Box>

          {isLoading ? (
            renderSkeletons()
          ) : dialogData.length > 0 ? (
            <Box>
              {dialogData.map((dialog) => (
                <Card key={dialog.id} sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleViewDialog(dialog.id)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                          {dialog.name}
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
                          {dialog.description || "Нет описания"}
                        </Typography>
                      </Box>
                      <Tooltip title="Подробнее">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            handleMenuOpen(e, dialog.id, "dialog")
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
                  У вас пока нет диалогов
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} disabled="true" onClick={() => setIsCreateDialogModalOpen(true)}>
                  Создать первый диалог
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

      <CreateDialogModal
        isOpen={isCreateDialogModalOpen}
        onClose={() => setIsCreateDialogModalOpen(false)}
        onCreateDialog={handleCreateDialog}
      />

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuItemClick}>Открыть</MenuItem>
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
