import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword, clearError } from '../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
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
    if (!formData.currentPassword) {
      errors.currentPassword = 'Введите текущий пароль';
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      errors.newPassword = 'Новый пароль должен содержать минимум 6 символов';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'Новый пароль должен отличаться от текущего';
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
      await dispatch(changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })).unwrap();
      toast.success('Пароль успешно изменен');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      // Ошибка уже обработана в useEffect
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Смена пароля</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Текущий пароль *</label>
          <input
            type="password"
            className={formErrors.currentPassword ? 'error' : ''}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          {formErrors.currentPassword && <div className="form-error">{formErrors.currentPassword}</div>}
        </div>
        <div className="form-group">
          <label>Новый пароль *</label>
          <input
            type="password"
            className={formErrors.newPassword ? 'error' : ''}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Минимум 6 символов"
          />
          {formErrors.newPassword && <div className="form-error">{formErrors.newPassword}</div>}
        </div>
        <div className="form-group">
          <label>Подтверждение нового пароля *</label>
          <input
            type="password"
            className={formErrors.confirmPassword ? 'error' : ''}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Изменение...' : 'Изменить пароль'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
