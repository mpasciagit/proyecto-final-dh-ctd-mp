import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthChoice from './pages/auth/AuthChoice.jsx';
import Login from './pages/auth/Login.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import CreateUserForm from './pages/usuarios/CreateUserForm.jsx';
import ChangePassword from './pages/usuarios/ChangePassword.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthChoice />} />
      <Route path="/crear-user" element={<CreateUserForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/panel" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
