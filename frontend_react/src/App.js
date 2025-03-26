import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [tabValue, setTabValue] = useState(0);

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsersREST();
  }, []);

  // REST
  const fetchUsersREST = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUserREST = async () => {
    try {
      await axios.post("http://localhost:3000/api/users", newUser);
      setNewUser({ name: "", email: "" });
      fetchUsersREST();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // SOAP
  const fetchUsersSOAP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/soap/service",
        `<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                          xmlns:user="http://example.com/user-service">
          <soapenv:Header/>
          <soapenv:Body>
            <user:getUsersRequest/>
          </soapenv:Body>
        </soapenv:Envelope>`,
        {
          headers: {
            "Content-Type": "text/xml",
          },
        }
      );

      // Parsear respuesta XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const users = Array.from(xmlDoc.getElementsByTagName("user")).map(
        (user) => ({
          id: user.getElementsByTagName("id")[0].textContent,
          name: user.getElementsByTagName("name")[0].textContent,
          email: user.getElementsByTagName("email")[0].textContent,
        })
      );

      setUsers(users);
    } catch (error) {
      console.error("Error fetching users via SOAP:", error);
    }
  };
  // Crear usuario via SOAP
  const createUserSOAP = async () => {
    try {
      await axios.post(
        "http://localhost:3000/soap/service",
        `<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                          xmlns:user="http://example.com/user-service">
          <soapenv:Header/>
          <soapenv:Body>
            <user:createUserRequest>
              <user:name>${newUser.name}</user:name>
              <user:email>${newUser.email}</user:email>
            </user:createUserRequest>
          </soapenv:Body>
        </soapenv:Envelope>`,
        {
          headers: {
            "Content-Type": "text/xml",
          },
        }
      );

      setNewUser({ name: "", email: "" });
      fetchUsersSOAP();
    } catch (error) {
      console.error("Error creating user via SOAP:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) fetchUsersREST();
    else fetchUsersSOAP();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestión de Usuarios
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="API tabs"
          centered
        >
          <Tab label="REST API" />
          <Tab label="SOAP API" />
        </Tabs>

        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            mt: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {tabValue === 0 ? "Usuarios (REST)" : "Usuarios (SOAP)"}
          </Typography>

          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                sx={{ borderBottom: 1, borderColor: "grey.200" }}
              >
                <ListItemText
                  primary={user.name}
                  secondary={`ID: ${user.id} - Email: ${user.email}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Agregar Nuevo Usuario
          </Typography>

          <Box component="form" sx={{ mb: 3 }}>
            <TextField
              label="Nombre"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <Button
              variant="contained"
              onClick={tabValue === 0 ? createUserREST : createUserSOAP}
              sx={{ mt: 2 }}
            >
              Agregar Usuario
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;
