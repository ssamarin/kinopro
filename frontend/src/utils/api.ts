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

// Универсальная функция для выполнения API-запросов
export const apiRequest = async <T>(url: string, options: RequestInit = {}, errorMessage?: string): Promise<T> => {
  try {
    // Проверяем наличие токена для авторизации
    const token = localStorage.getItem('token');
    const isAuthRequest = token && !url.includes('/login') && !url.includes('/register');
    
    // Выбираем соответствующий метод запроса
    const response = isAuthRequest
      ? await fetchWithAuth(url, options)
      : await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorMessage || `Ошибка запроса: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при запросе ${url}:`, error);
    throw error;
  }
};

// Получение профиля пользователя
export const fetchUserProfile = async () => {
  return apiRequest('/api/users/profile', {}, 'Не удалось загрузить данные профиля');
};

// Обновление профиля пользователя
export const updateUserProfile = async (data: { firstName: string; lastName: string }) => {
  return apiRequest('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }, 'Ошибка при обновлении профиля');
};

// Получение списка городов
export const fetchCities = async () => {
  return apiRequest('/api/cities', {}, 'Не удалось загрузить список городов');
};

// Получение списка групп профессий
export const fetchProfessionGroups = async () => {
  return apiRequest('/api/profession-groups', {}, 'Не удалось загрузить группы профессий');
};

// Получение списка профессий
export const fetchProfessions = async () => {
  return apiRequest('/api/professions', {}, 'Не удалось загрузить профессии');
};

// Сохранение резюме
export const saveResume = async (resumeData: any, isEditMode: boolean, resumeId?: number) => {
  const url = isEditMode ? `/api/resumes/${resumeId}` : '/api/resumes';
  const method = isEditMode ? 'PUT' : 'POST';
  
  return apiRequest(url, {
    method,
    body: JSON.stringify(resumeData)
  }, 'Ошибка при сохранении данных');
}; 