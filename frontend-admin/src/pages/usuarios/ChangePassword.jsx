import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
        currentPassword,
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
    <div
      style={{
        maxWidth: 500,
        margin: '2rem auto',
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: 8,
        background: 'white',
      }}
    >
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          Contraseña actual
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nueva contraseña
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar nueva contraseña
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
}
