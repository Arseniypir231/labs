// Валидация форм на клиенте

export const validateVehicle = (data) => {
  const errors = {};

  if (!data.licensePlate || data.licensePlate.trim().length < 2) {
    errors.licensePlate = 'Номерной знак должен содержать минимум 2 символа';
  }

  if (!data.brand || data.brand.trim().length === 0) {
    errors.brand = 'Марка обязательна для заполнения';
  }

  if (!data.model || data.model.trim().length === 0) {
    errors.model = 'Модель обязательна для заполнения';
  }

  if (!data.capacity || parseFloat(data.capacity) <= 0) {
    errors.capacity = 'Грузоподъемность должна быть больше 0';
  }

  if (!data.year || parseInt(data.year) < 1900 || parseInt(data.year) > new Date().getFullYear() + 1) {
    errors.year = `Год выпуска должен быть от 1900 до ${new Date().getFullYear() + 1}`;
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl);
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным';
    }
  }

  return errors;
};

export const validateRoute = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Название маршрута обязательно для заполнения';
  }

  if (!data.origin || data.origin.trim().length === 0) {
    errors.origin = 'Точка отправления обязательна для заполнения';
  }

  if (!data.destination || data.destination.trim().length === 0) {
    errors.destination = 'Точка назначения обязательна для заполнения';
  }

  if (!data.distance || parseFloat(data.distance) <= 0) {
    errors.distance = 'Расстояние должно быть больше 0';
  }

  if (!data.estimatedTime || parseInt(data.estimatedTime) <= 0) {
    errors.estimatedTime = 'Оценочное время должно быть больше 0';
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl);
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным';
    }
  }

  return errors;
};

export const validateShipment = (data) => {
  const errors = {};

  if (!data.vehicleId) {
    errors.vehicleId = 'Транспортное средство обязательно для выбора';
  }

  if (!data.routeId) {
    errors.routeId = 'Маршрут обязателен для выбора';
  }

  if (!data.cargoDescription || data.cargoDescription.trim().length === 0) {
    errors.cargoDescription = 'Описание груза обязательно для заполнения';
  }

  if (!data.weight || parseFloat(data.weight) <= 0) {
    errors.weight = 'Вес должен быть больше 0';
  }

  if (!data.departureDate) {
    errors.departureDate = 'Дата отправления обязательна для заполнения';
  }

  if (data.deliveryDate && data.departureDate) {
    if (new Date(data.deliveryDate) < new Date(data.departureDate)) {
      errors.deliveryDate = 'Дата доставки не может быть раньше даты отправления';
    }
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl);
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным';
    }
  }

  return errors;
};
