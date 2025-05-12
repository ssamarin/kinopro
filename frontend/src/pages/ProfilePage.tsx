import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { 
  fetchUserProfile, 
  fetchCities, 
  fetchProfessionGroups,
  fetchProfessions,
  updateUserProfile as apiUpdateUserProfile,
  saveResume
} from '../utils/api';

interface City {
  id: number;
  city: string;
}

interface ProfessionGroup {
  id: number;
  name: string;
}

interface Profession {
  id: number;
  group_id: number;
  name: string;
}

interface Resume {
  id?: number;
  owner_user_id: number;
  professions_id: number;
  city_id: number;
  biography: string;
  media_url: string;
  since?: string;
  experienceYears?: number;
}

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  resume: Resume | null;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [professionGroupId, setProfessionGroupId] = useState<number | ''>('');
  const [professionId, setProfessionId] = useState<number | ''>('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [experience, setExperience] = useState<number | ''>('');
  const [biography, setBiography] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  
  const [cities, setCities] = useState<City[]>([]);
  const [professionGroups, setProfessionGroups] = useState<ProfessionGroup[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [filteredProfessions, setFilteredProfessions] = useState<Profession[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingResume, setExistingResume] = useState<Resume | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Функция для обработки данных резюме пользователя
  const processResumeData = (resumeData: any, professionsData: Profession[]) => {
    console.log('Обработка резюме пользователя:', resumeData);
    setExistingResume(resumeData);
    setIsEditMode(true);
    
    // Определяем ID профессии из разных возможных полей
    const profId = resumeData.professionId || resumeData.professions_id;
    console.log('ID профессии из резюме:', profId);
    
    if (profId) {
      setProfessionId(profId);
      
      // Находим профессию по ID
      const profession = professionsData.find((p: Profession) => p.id === profId);
      console.log('Найдена профессия:', profession);
      
      if (profession) {
        // Устанавливаем группу профессии
        console.log('Устанавливаем группу профессии:', profession.group_id);
        setProfessionGroupId(profession.group_id);
        
        // Фильтруем профессии по группе
        const filtered = professionsData.filter((p: Profession) => p.group_id === profession.group_id);
        console.log('Отфильтрованные профессии для группы:', filtered);
        setFilteredProfessions(filtered);
      } else {
        console.warn('Профессия с ID', profId, 'не найдена в списке профессий');
      }
    }
    
    // Определяем ID города
    const cityIdValue = resumeData.cityId || resumeData.city_id;
    if (cityIdValue) {
      setCityId(cityIdValue);
    }
    
    // Устанавливаем прочие поля
    setBiography(resumeData.biography || '');
    setMediaUrl(resumeData.mediaUrl || resumeData.media_url || '');
    
    // Устанавливаем опыт работы
    const expYears = resumeData.experienceYears || resumeData.experience_years;
    if (expYears) {
      setExperience(expYears);
    }
  };

  // Загрузка данных для селекторов и существующего резюме
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // Загрузка всех необходимых данных
        const [profileData, citiesData, professionGroupsData, professionsData] = await Promise.all([
          fetchUserProfile(),
          fetchCities(),
          fetchProfessionGroups(),
          fetchProfessions()
        ]);
        
        console.log('Загруженные данные профиля:', profileData);
        setUserProfile(profileData);
        
        // Заполняем поля формы данными профиля
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        
        setCities(citiesData);
        setProfessionGroups(professionGroupsData);
        setProfessions(professionsData);
        
        // Обработка резюме
        if (profileData.resume) {
          processResumeData(profileData.resume, professionsData);
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id]);
  
  // Фильтрация профессий при изменении группы
  useEffect(() => {
    if (professionGroupId) {
      const filtered = professions.filter(p => p.group_id === professionGroupId);
      setFilteredProfessions(filtered);
      
      // Сбросить выбранную профессию, если она не из текущей группы
      if (professionId && !filtered.some(p => p.id === professionId)) {
        setProfessionId('');
      }
    } else {
      setFilteredProfessions([]);
      setProfessionId('');
    }
  }, [professionGroupId, professions, professionId]);

  // Обновление данных профиля пользователя
  const handleUpdateProfile = async () => {
    if (!firstName || !lastName) {
      setError('Пожалуйста, заполните имя и фамилию');
      return false;
    }
    
    try {
      const updatedProfile = await apiUpdateUserProfile({ firstName, lastName });
      
      // Обновляем данные пользователя в контексте
      updateUserProfile(updatedProfile.firstName, updatedProfile.lastName);
      
      return true;
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте позже.');
      return false;
    }
  };

  // Сохранение данных резюме
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !professionId || !cityId) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // Сначала обновляем профиль пользователя
    const profileUpdated = await handleUpdateProfile();
    if (!profileUpdated) {
      setIsLoading(false);
      return;
    }
    
    // Затем обновляем резюме
    const resumeData = {
      owner_user_id: user.id,
      professions_id: professionId,
      city_id: cityId,
      biography,
      media_url: mediaUrl,
      experience_years: experience || undefined
    };
    
    try {
      const resumeResponse = await saveResume(resumeData, isEditMode, existingResume?.id);
      
      setSuccess(isEditMode 
        ? 'Информация успешно обновлена!' 
        : 'Информация успешно добавлена!'
      );
      
      // Если это было создание нового резюме, переключаемся в режим редактирования
      if (!isEditMode) {
        setExistingResume(resumeResponse);
        setIsEditMode(true);
      }
      
      // Обновляем данные на странице
      await refreshUserProfile();
      
    } catch (err) {
      console.error('Ошибка при сохранении данных:', err);
      setError('Произошла ошибка при сохранении данных. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция для обновления профиля пользователя
  const refreshUserProfile = async () => {
    try {
      const profileData = await fetchUserProfile();
      console.log('Обновленные данные профиля:', profileData);
      setUserProfile(profileData);
      
      // Обновляем данные формы
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      
      if (profileData.resume) {
        processResumeData(profileData.resume, professions);
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
  };

  if (isLoading && !existingResume) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 4, 
                fontWeight: 'bold',
                color: 'primary.main' 
              }}
            >
              Расскажи о себе всей киноиндустрии
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
                {success}
              </Alert>
            )}
            
            {(!firstName || !lastName) && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  width: '100%',
                  borderLeft: '4px solid #2196f3',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Добро пожаловать в KinoPro!
                </Typography>
                <Typography variant="body2">
                  Пожалуйста, заполните ваше имя и фамилию, чтобы другие пользователи могли вас узнать.
                  Эта информация будет отображаться в вашем профиле.
                </Typography>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={3} sx={{ width: '100%' }}>
                <TextField
                  label="Имя"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                  error={!firstName}
                  helperText={!firstName ? "Пожалуйста, укажите ваше имя" : ""}
                />
                
                <TextField
                  label="Фамилия"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                  error={!lastName}
                  helperText={!lastName ? "Пожалуйста, укажите вашу фамилию" : ""}
                />
                
                <FormControl fullWidth required>
                  <InputLabel id="profession-group-label">Группа профессий</InputLabel>
                  <Select
                    labelId="profession-group-label"
                    value={professionGroupId}
                    onChange={(e) => setProfessionGroupId(e.target.value as number)}
                    label="Группа профессий"
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {professionGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth required disabled={!professionGroupId}>
                  <InputLabel id="profession-label">Профессия</InputLabel>
                  <Select
                    labelId="profession-label"
                    value={professionId}
                    onChange={(e) => setProfessionId(e.target.value as number)}
                    label="Профессия"
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {filteredProfessions.map((profession) => (
                      <MenuItem key={profession.id} value={profession.id}>
                        {profession.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth required>
                  <InputLabel id="experience-label">Опыт работы (лет)</InputLabel>
                  <Select
                    labelId="experience-label"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value as number)}
                    label="Опыт работы (лет)"
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth required>
                  <InputLabel id="city-label">Город</InputLabel>
                  <Select
                    labelId="city-label"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value as number)}
                    label="Город"
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Ссылка на изображение"
                  fullWidth
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  helperText="Укажите URL изображения для вашего профиля"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                
                <TextField
                  label="Биография"
                  fullWidth
                  multiline
                  rows={6}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Расскажите о своем опыте, навыках и достижениях в киноиндустрии..."
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      fontSize: '1.1rem',
                      minWidth: '200px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : isEditMode ? 'Обновить информацию' : 'Сохранить информацию'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage; 