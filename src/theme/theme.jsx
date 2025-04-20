import { createTheme } from "@mui/material/styles"

// Создаем профессиональную цветовую палитру
export const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50", // Глубокий синий для основных элементов
      light: "#34495e",
      dark: "#1a252f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3498db", // Яркий синий для акцентов
      light: "#5dade2",
      dark: "#2980b9",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2ecc71",
      light: "#58d68d",
      dark: "#27ae60",
    },
    error: {
      main: "#e74c3c",
      light: "#ec7063",
      dark: "#c0392b",
    },
    warning: {
      main: "#f39c12",
      light: "#f5b041",
      dark: "#d35400",
    },
    info: {
      main: "#3498db",
      light: "#5dade2",
      dark: "#2980b9",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#7f8c8d",
      disabled: "#bdc3c7",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    divider: "#ecf0f1",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "20px 24px 0px 24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px 24px",
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #ecf0f1",
          padding: "16px 24px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc",
          color: "#2c3e50",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "24px 24px 16px 24px",
          fontSize: "1.25rem",
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px 24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})
