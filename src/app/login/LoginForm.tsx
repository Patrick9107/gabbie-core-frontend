import { Button, TextField, Typography, CircularProgress, Box, Paper, Alert } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen'; // Importiert ein passendes Icon
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../infra/api/authService.ts';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider.tsx';
import { useEffect } from "react";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  [key: string]: any;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsTokenValid, setRole } = useAuth();

  const { mutateAsync, status, error, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: { token: string }) => {
      localStorage.setItem('authToken', data.token);

      try {
        const decodedToken = jwtDecode<DecodedToken>(data.token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        localStorage.setItem('role', userRole);
        localStorage.setItem('name', userName);
        setRole(userRole);
        setIsTokenValid(true);
        navigate('/');
      } catch (decodeError) {
        console.error('Fehler beim Dekodieren des Tokens:', decodeError);
        localStorage.clear();
        setIsTokenValid(false);
        setRole('');
      }
    },
    onError: (err) => {
      console.error('Login-Fehler:', err);
    }
  });

  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleSubmit = async (values: { username: string; password: string }) => {
    await mutateAsync(values);
  };

  return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{
            background: 'linear-gradient(to bottom, #e8f5e9, #ffffff)',
          }}
          p={2}
      >
        <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '12px',
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
           <img src="/logo-icon.svg" alt="GABBIE Logo" style={{ marginBottom: '16px', height: '50px' }} />

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium' }}>
            Anmelden
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
            Willkommen zurück! Bitte gib deine Daten ein.
          </Typography>

          <Formik
              initialValues={{ username: '', password: '' }}
              validate={(values) => {
                const errors: { username?: string; password?: string } = {};
                if (!values.username.trim()) {
                  errors.username = 'Benutzername erforderlich';
                }
                if (!values.password) {
                  errors.password = 'Passwort erforderlich';
                }
                return errors;
              }}
              onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, handleSubmit: formikSubmit, errors, touched }) => (
                <Box component="form" onSubmit={formikSubmit} sx={{ width: '100%', mt: 1 }}>
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Benutzername"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      variant="filled"
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Passwort"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      variant="filled"
                  />

                  {isError && error && (
                      <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {typeof error === 'object' && error !== null && 'message' in error
                            ? String(error.message)
                            : 'Ein unerwarteter Fehler ist aufgetreten.'}
                      </Alert>
                  )}

                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={status === 'pending'}
                      startIcon={status === 'pending' ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        bgcolor: '#235817',
                        '&:hover': {
                          bgcolor: '#1a4311',
                        }
                      }}
                  >
                    {status === 'pending' ? 'Anmelden...' : 'Anmelden'}
                  </Button>
                </Box>
            )}
          </Formik>
        </Paper>
      </Box>
  );
};

export default LoginForm;