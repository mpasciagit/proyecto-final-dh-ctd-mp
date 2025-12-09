import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  // Autocompletar token si viene en la URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess('Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo restablecer la contraseña. Verifica el token e intenta nuevamente.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Restablecer contraseña</h2>
            <form onSubmit={handleSubmit} className="reset-form">
                <label htmlFor="token">Token</label>
                <input
                    type="text"
                    id="token"
                    name="token"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    required
                    placeholder="Token de recuperación"
                />
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="login-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div className="login-show-password-row">
                  <input
                    id="show-password-reset"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((v) => !v)}
                    style={{ marginRight: "0.5em" }}
                  />
                  <label
                    htmlFor="show-password-reset"
                    style={{ userSelect: "none", cursor: "pointer" }}
                  >
                    Mostrar contraseña
                  </label>
                </div>
                {error && <p className="reset-error">{error}</p>}
                {success && <p className="reset-success">{success}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                </button>
            </form>
      <div className="reset-links">
        <Link to="/">Volver a iniciar sesión</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
