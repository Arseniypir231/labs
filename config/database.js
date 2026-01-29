const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_logistics';
    
    console.log('🔄 Подключение к MongoDB...');
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  Используется встроенная строка подключения (для тестирования)');
    }
    
    const uriForLog = mongoURI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log(`📡 Подключение к: ${uriForLog.split('?')[0]}`);
    console.log(`📦 База данных: ${mongoURI.split('/').pop().split('?')[0] || 'default'}`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('\n❌ Ошибка подключения к MongoDB:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('not whitelisted')) {
      console.error('🔴 ПРОБЛЕМА: Проблема с IP адресом или whitelist');
      console.error('\n💡 Проверьте:');
      console.error('   1. IP адрес 0.0.0.0/0 должен быть в списке Network Access');
      console.error('   2. Статус должен быть "Active" (зеленая галочка)');
      console.error('   3. Если IP добавлен недавно, подождите 2-3 минуты');
      console.error('   4. Попробуйте удалить и заново добавить IP адрес\n');
    } else if (error.message.includes('authentication') || error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('🔴 ПРОБЛЕМА: Неверные учетные данные');
      console.error('\n💡 Решение:');
      console.error('   1. Проверьте username и password в строке подключения');
      console.error('   2. Убедитесь, что пользователь существует в "Database Access"');
      console.error('   3. Проверьте, что у пользователя есть права доступа\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo') || error.message.includes('DNS')) {
      console.error('🔴 ПРОБЛЕМА: Не удается найти хост');
      console.error('\n💡 Решение:');
      console.error('   1. Проверьте правильность hostname в строке подключения');
      console.error('   2. Проверьте интернет-соединение');
      console.error('   3. Убедитесь, что кластер существует в Atlas\n');
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      console.error('🔴 ПРОБЛЕМА: Таймаут подключения');
      console.error('\n💡 Решение:');
      console.error('   1. Проверьте интернет-соединение');
      console.error('   2. Убедитесь, что ваш IP добавлен в whitelist');
      console.error('   3. Попробуйте снова через несколько минут\n');
    } else {
      console.error('🔴 Неизвестная ошибка');
      console.error('\n💡 Попробуйте:');
      console.error('   1. Проверить все вышеперечисленные пункты');
      console.error('   2. Проверить статус кластера в Atlas Dashboard');
      console.error('   3. Убедиться, что кластер не приостановлен\n');
    }
    
    console.error('📋 Дополнительная информация:');
    console.error(`   Код ошибки: ${error.name}`);
    console.error(`   Полное сообщение: ${error.message}`);
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n🔍 Дополнительные проверки:');
      console.error('   1. Проверьте "Database Access" - существует ли пользователь "admin"?');
      console.error('   2. Правильный ли пароль у пользователя "admin"?');
      console.error('   3. Проверьте статус кластера - не приостановлен ли он?');
      console.error('   4. Попробуйте получить новую строку подключения из Atlas:');
      console.error('      - Connect → Connect your application → Copy connection string');
      console.error('   5. Убедитесь, что в строке подключения правильный пароль\n');
    }
    
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n')[0]}`);
    }
    console.error('');
    
    process.exit(1);
  }
};

module.exports = connectDB;
