import { Link } from "react-router-dom"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import BusinessIcon from "@mui/icons-material/Business"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

function ContractorsList({ contractors }) {
  if (!contractors || contractors.length === 0) {
    return (
      <Card sx={{ textAlign: "center", py: 4 }}>
        <CardContent>
          <Typography color="text.secondary">Данных о контрагентах не найдено.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      {contractors.map((contractor) => (
        <Grid item xs={12} sm={6} md={4} key={contractor.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" component="h3" fontWeight={600} noWrap>
                  {contractor.customName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ID: {contractor.id}
              </Typography>
              <Button
                component={Link}
                to={`/contractor/${contractor.id}`}
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: "auto" }}
              >
                Подробнее
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ContractorsList
