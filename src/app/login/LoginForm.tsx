import { Button, TextField, Typography, CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../infra/api/authService.ts';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider.tsx';


const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsTokenValid, setRole } = useAuth(); // Access set function from context

  const { mutateAsync, status, error, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: { token: string }) => {
      localStorage.setItem('authToken', data.token);

      const decodedToken = JSON.parse(JSON.stringify(jwtDecode(data.token)));
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      setRole(role);
      setIsTokenValid(true); // Set the token validity to true
      navigate('/');
    },
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await mutateAsync(values);
    } catch (err) {
      console.error('Fehler beim Absenden des Formulars:', err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="white"
      p={3}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="white"
        p={4}
        borderRadius="8px"
        boxShadow={3}
        width="100%"
        maxWidth="400px"
      >
        <Typography variant="h5" gutterBottom>
          Logge dich in dein Konto ein
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={(values) => {
            const errors: { username?: string; password?: string } = {};
            if (!values.username) {
              errors.username = 'Benutzername erforderlich';
            }
            if (!values.password) {
              errors.password = 'Passwort erforderlich';
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Benutzername"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Passwort"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  variant="outlined"
                  size="small"
                />
              </Box>
              {isError && (
                <Box mb={2}>
                  <Typography variant="body2" color="error" align="center">
                    {error?.message}
                  </Typography>
                </Box>
              )}
              <Box mb={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={status === 'pending'} // Button deaktivieren, wenn die Mutation läuft
                  size="large"
                  sx={{ padding: '12px 0',  bgcolor: "#235817" }}
                >
                  {status === 'pending' ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default LoginForm;
