import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword, clearError } from '../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    const errors = {};
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
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
      await dispatch(resetPassword({
        token,
        password: formData.password
      })).unwrap();
      toast.success('Пароль успешно сброшен');
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Ошибка уже обработана в useEffect
    }
  };

  if (success) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <ToastContainer />
        <h2>Пароль успешно сброшен</h2>
        <p>Ваш пароль был успешно изменен. Вы будете перенаправлены на страницу входа.</p>
        <Link to="/login" className="btn btn-primary">Перейти к входу</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Сброс пароля</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Новый пароль *</label>
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
          {loading ? 'Сброс...' : 'Сбросить пароль'}
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/login">Вернуться к входу</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
