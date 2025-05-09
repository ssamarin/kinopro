/**
 * Утилиты для работы с API
 */

// Функция для выполнения аутентифицированных запросов
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  // Объединяем стандартные и пользовательские заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  
  // Возвращаем результат запроса с добавленными заголовками
  return fetch(url, {
    ...options,
    headers
  });
};

// Получение профиля пользователя
export const fetchUserProfile = async () => {
  try {
    const response = await fetchWithAuth('/api/users/profile');
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные профиля');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    throw error;
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (data: { firstName: string; lastName: string }) => {
  try {
    const response = await fetchWithAuth('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при обновлении профиля');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    throw error;
  }
};

// Получение списка городов
export const fetchCities = async () => {
  try {
    const response = await fetch('/api/cities');
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить список городов');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении городов:', error);
    throw error;
  }
};

// Получение списка групп профессий
export const fetchProfessionGroups = async () => {
  try {
    const response = await fetch('/api/profession-groups');
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить группы профессий');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении групп профессий:', error);
    throw error;
  }
};

// Получение списка профессий
export const fetchProfessions = async () => {
  try {
    const response = await fetch('/api/professions');
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить профессии');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении профессий:', error);
    throw error;
  }
};

// Сохранение резюме
export const saveResume = async (resumeData: any, isEditMode: boolean, resumeId?: number) => {
  try {
    const url = isEditMode ? `/api/resumes/${resumeId}` : '/api/resumes';
    const method = isEditMode ? 'PUT' : 'POST';
    
    const response = await fetchWithAuth(url, {
      method,
      body: JSON.stringify(resumeData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при сохранении данных');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при сохранении резюме:', error);
    throw error;
  }
}; 