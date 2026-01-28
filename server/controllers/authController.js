const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const nodemailer = require('nodemailer');

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Настройка транспорта для отправки email (для восстановления пароля)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    // Генерация токена
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
};

// Авторизация пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны для заполнения' });
    }

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка активности
    if (!user.isActive) {
      return res.status(401).json({ error: 'Аккаунт деактивирован' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = generateToken(user.id);

    res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при авторизации' });
  }
};

// Получение информации о текущем пользователе
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
  }
};

// Смена пароля
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверка текущего пароля
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Текущий пароль неверен' });
    }

    // Валидация нового пароля
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Новый пароль должен содержать минимум 6 символов' });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при смене пароля' });
  }
};

// Запрос на восстановление пароля
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email обязателен для заполнения' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Для безопасности не сообщаем, что пользователь не найден
      return res.json({ message: 'Если пользователь с таким email существует, инструкции по восстановлению пароля отправлены на email' });
    }

    // Генерация токена сброса
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Отправка email (если настроен SMTP)
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Восстановление пароля',
        html: `
          <h2>Восстановление пароля</h2>
          <p>Вы запросили восстановление пароля. Перейдите по ссылке ниже для сброса пароля:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Ссылка действительна в течение 10 минут.</p>
          <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
        `
      });
    }

    res.json({ 
      message: 'Если пользователь с таким email существует, инструкции по восстановлению пароля отправлены на email',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined // Только для разработки
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при запросе восстановления пароля' });
  }
};

// Сброс пароля по токену
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Токен и новый пароль обязательны' });
    }

    // Хеширование токена для поиска
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Поиск пользователя по токену
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          [require('sequelize').Op.gt]: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Токен недействителен или истек' });
    }

    // Валидация пароля
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    // Обновление пароля и очистка токена
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при сбросе пароля' });
  }
};
