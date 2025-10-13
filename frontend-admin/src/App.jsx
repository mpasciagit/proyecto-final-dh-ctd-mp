import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthChoice from './pages/AuthChoice.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import CreateAdminForm from './pages/usuarios/CreateAdminForm.jsx';
import ChangePassword from './pages/usuarios/ChangePassword.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthChoice />} />
      <Route path="/crear-admin" element={<CreateAdminForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/panel" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
