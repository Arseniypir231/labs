import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user'
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
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    if (!formData.firstName || formData.firstName.trim().length === 0) {
      errors.firstName = 'Имя обязательно для заполнения';
    }
    if (!formData.lastName || formData.lastName.trim().length === 0) {
      errors.lastName = 'Фамилия обязательна для заполнения';
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
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      toast.success('Регистрация успешна');
      navigate('/');
    } catch (err) {
      // Ошибка уже обработана в useEffect
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Регистрация</h2>
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
          <label>Имя *</label>
          <input
            type="text"
            className={formErrors.firstName ? 'error' : ''}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          {formErrors.firstName && <div className="form-error">{formErrors.firstName}</div>}
        </div>
        <div className="form-group">
          <label>Фамилия *</label>
          <input
            type="text"
            className={formErrors.lastName ? 'error' : ''}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          {formErrors.lastName && <div className="form-error">{formErrors.lastName}</div>}
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
        <div className="form-group">
          <label>Подтверждение пароля *</label>
          <input
            type="password"
            className={formErrors.confirmPassword ? 'error' : ''}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
