import { Button, TextField, Typography, CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../infra/api/authService.ts';
import { useNavigate } from 'react-router-dom'; // Der Service, der die API aufruft

const LoginForm = () => {
  const navigate = useNavigate();
  // Verwende `useMutation` mit der Mutation-Funktion und den Statuswerten
  const { mutateAsync, status, error, isError, } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: { token: string }) => {
      localStorage.setItem('authToken', data.token);
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
      bgcolor="#f4f6f9"
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
        <Typography variant="h5" color="primary" gutterBottom>
          Login to Your Account
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={(values) => {
            const errors: { username?: string; password?: string } = {};
            if (!values.username) {
              errors.username = 'Username is required';
            }
            if (!values.password) {
              errors.password = 'Password is required';
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
                  label="Username"
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
                  label="Password"
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
                  color="primary"
                  fullWidth
                  disabled={status === 'pending'} // Button deaktivieren, wenn die Mutation läuft
                  size="large"
                  sx={{ padding: '12px 0' }}
                >
                  {status === 'pending' ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
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
