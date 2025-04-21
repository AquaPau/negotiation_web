"use client"

import { useState, useEffect } from "react"
import { api } from "@/api/api"
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import Divider from "@mui/material/Divider"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import MarkdownRenderer from "@/components/MarkdownRenderer"

const FAQ = () => {
  const [faqContent, setFaqContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

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
    fetchFAQContent()
  }, [])

  const fetchFAQContent = async () => {
    setIsLoading(true)
    try {
      const response = await api.getFAQ()
      setFaqContent(response.data)
    } catch (error) {
      const message = error?.response?.data ?? "Не удалось загрузить FAQ"
      setErrorMessage(message)
      handleOpenSnack()
      //console.error("Failed to fetch FAQ content:", error)
      setFaqContent("# FAQ\n\nИнформация временно недоступна. Пожалуйста, попробуйте позже.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Главная
        </Link>
        <Typography color="text.primary">FAQ</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <HelpOutlineIcon sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
        <Typography variant="h4" component="h1" fontWeight={700}>
          Приложение для подготовки юристов к переговорному процессу
        </Typography>
      </Box>

      {/* FAQ Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {isLoading ? (
            <Box>
              <Skeleton variant="text" height={60} width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={20} width="90%" />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="85%" />
              <Box sx={{ mt: 3, mb: 3 }}>
                <Divider />
              </Box>
              <Skeleton variant="text" height={40} width="50%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={20} width="95%" />
              <Skeleton variant="text" height={20} width="90%" />
              <Skeleton variant="text" height={20} width="88%" />
            </Box>
          ) : (
            <MarkdownRenderer>{faqContent}</MarkdownRenderer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default FAQ
