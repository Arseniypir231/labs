import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Введите валидный email';
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Успешная авторизация');
      navigate('/');
    } catch (err) {
      // Ошибка уже обработана в useEffect
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            className={formErrors.email ? 'error' : ''}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@mail.com"
          />
          {formErrors.email && <div className="form-error">{formErrors.email}</div>}
        </div>
        <div className="form-group">
          <label>Пароль *</label>
          <input
            type="password"
            className={formErrors.password ? 'error' : ''}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Минимум 6 символов"
          />
          {formErrors.password && <div className="form-error">{formErrors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/forgot-password">Забыли пароль?</Link>
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
