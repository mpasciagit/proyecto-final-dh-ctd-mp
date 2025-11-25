import { useState } from 'react';
import '../../styles/CreateUserForm.css';
import '../../styles/ChangePassword.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No encontré token. Iniciá sesión primero.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        oldPassword: currentPassword,
        newPassword,
      };

      const resp = await axios.post(
        'http://localhost:8080/api/auth/change-password',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Contraseña cambiada con éxito.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Opcional: redirigir al login
      // navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          `Error ${err.response.status}: ${
            err.response.data?.message || JSON.stringify(err.response.data)
          }`
        );
      } else {
        setError('Error de conexión o interno. Revisá la consola.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit} className="create-admin-form">
        <label>
          Actual contraseña
          <input
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nueva contraseña
          <input
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar nueva contraseña
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <div className="change-password-actions">
          <div style={{ minWidth: 0, flex: 1, display: 'flex' }}>
            <div style={{ width: '84px' }}></div>
            <label className="change-password-checkbox">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={e => setShowPasswords(e.target.checked)}                
              />
              Mostrar contraseñas
            </label>
          </div>
          <button type="submit" disabled={loading} className="change-password-button">
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </div>

  {error && <p className="change-password-error">{error}</p>}
  {message && <p className="change-password-success">{message}</p>}
      </form>
    </div>
  );
}
