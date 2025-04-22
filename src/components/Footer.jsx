"use client"

import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 2 }}></Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Система для подготовки к переговорам на основе юридических документов
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Полезные ссылки
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  to="/faq"
                  style={{
                    color: theme.palette.text.secondary,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HelpOutlineIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="body2">Описание проекта</Typography>
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Контакты
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                support@legentum.com
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                +7 (800) 123-45-67
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: isMobile ? "center" : "space-between", flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary" align={isMobile ? "center" : "left"}>
            © {currentYear} Legentum. Все права защищены.
          </Typography>
          {!isMobile && (
            <Box>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 1 }}>
                <Link to="/terms" className="disabledCursor" onClick={ (event) => event.preventDefault() } style={{ color: "inherit", textDecoration: "none" }}>
                  Условия использования
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 1 }}>
                <Link to="/privacy" className="disabledCursor" onClick={ (event) => event.preventDefault() } style={{ color: "inherit", textDecoration: "none" }}>
                  Политика конфиденциальности
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

