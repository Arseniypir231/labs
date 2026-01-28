import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword, clearError } from '../store/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';

function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Введите валидный email');
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success('Если пользователь с таким email существует, инструкции отправлены на email');
      setSubmitted(true);
    } catch (err) {
      // Ошибка уже обработана в useEffect
    }
  };

  if (submitted) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <ToastContainer />
        <h2>Запрос отправлен</h2>
        <p>Если пользователь с таким email существует, инструкции по восстановлению пароля отправлены на указанный адрес.</p>
        <Link to="/login" className="btn btn-primary">Вернуться к входу</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Восстановление пароля</h2>
      <p>Введите ваш email, и мы отправим инструкции по восстановлению пароля.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            className={emailError ? 'error' : ''}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
          {emailError && <div className="form-error">{emailError}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/login">Вернуться к входу</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
