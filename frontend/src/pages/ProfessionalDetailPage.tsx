import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Button, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import { useFavorites } from '../context/FavoritesContext';
import { Professional } from '../components/ProfessionalCard';
import ReviewForm from '../components/ReviewForm';
import FavoriteListModal from '../components/FavoriteListModal';

// Обновим интерфейс для профессионала
interface ProfessionalDetail {
  id: number;
  userId: number;
  name: string;
  profession: string;
  rating: number | null;
  experience: string;
  location: string;
  photo: string;
  biography: string;
  reviews?: Review[];
  reviewsCount?: number;
}

// Добавим интерфейс для отзывов
interface Review {
  id: number;
  rating: number;
  text: string;
  reviewerName: string;
  createdAt: string;
}

const StyledImage = styled('div')(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: 16,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${theme.palette.divider}`,
}));

const WorkSample = styled('div')(({ theme }) => ({
  minWidth: 200,
  height: 300,
  borderRadius: 8,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[800],
}));

const VideoSample = styled('div')(({ theme }) => ({
  minWidth: 300,
  height: 200,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[800],
}));

const CompactPhoto = styled('div')(({ theme }) => ({
  width: 96,
  height: 96,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

// Моковые проекты для примеров работ
const mockProjects = [
  {
    id: 1,
    title: 'Рекламный ролик для бренда X',
    description: 'Съёмка и монтаж рекламного ролика для крупного бренда одежды.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Короткометражный фильм "Вдохновение"',
    description: 'Работа оператором и пост-продакшн на независимом кинофестивале.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Музыкальный клип для группы Y',
    description: 'Полный цикл видеопроизводства для музыкального коллектива.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: 'Документальный проект',
    description: 'Съёмка и монтаж документального фильма о путешествиях.',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
  },
];

const ProjectCard = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

const ProjectImage = styled('div')({
  width: '100%',
  height: 160,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

// Моковые отзывы
const mockReviews = [
  { id: 1, text: 'Очень профессиональный подход, всё понравилось!', rating: 5 },
  { id: 2, text: 'Быстро и качественно выполнил работу.', rating: 4 },
  { id: 3, text: 'Рекомендую, отличный специалист.', rating: 5 },
  { id: 4, text: 'Всё устроило, спасибо!', rating: 4 },
];

const ReviewCard = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 10,
  boxShadow: theme.shadows[1],
  minWidth: 220,
  maxWidth: 260,
  height: 80,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

// Определим правильные типы для чата
interface Chat {
  id: number;
  userId: number;
  userName: string;
  userPhoto: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface Message {
  id: number;
  sender: 'user' | 'professional';
  text: string;
  timestamp: string;
  isRead: boolean;
}

type ChatWindowProps = {
  open: boolean;
  onClose: () => void;
  chats: Chat[];
  activeChatId: number;
  setActiveChatId: (id: number) => void;
  onSend: (text: string) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ open, onClose, chats, activeChatId, setActiveChatId, onSend, inputValue, setInputValue }) => {
  const activeChat = chats.find(c => c.id === activeChatId);
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.45)',
        zIndex: 1300,
        display: open ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: { xs: '100vw', sm: 700 },
          height: { xs: '100vh', sm: 600 },
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: 6,
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        {/* Список чатов */}
        <Box sx={{ width: 220, borderRight: 1, borderColor: 'divider', bgcolor: 'background.default', display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', fontWeight: 'bold', fontSize: 18 }}>Чаты</Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {chats.map(chat => (
              <Box
                key={chat.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5,
                  cursor: 'pointer',
                  bgcolor: chat.id === activeChatId ? 'primary.main' : 'transparent',
                  color: chat.id === activeChatId ? 'white' : 'text.primary',
                  fontWeight: chat.id === activeChatId ? 600 : 400,
                  borderRadius: 2,
                  mb: 0.5,
                  transition: 'background 0.2s',
                }}
                onClick={() => setActiveChatId(chat.id)}
                tabIndex={0}
                aria-label={`Открыть чат с ${chat.userName}`}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                  {chat.userPhoto ? <img src={chat.userPhoto} alt={chat.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : chat.userName[0]}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 'inherit', fontSize: 15 }}>{chat.userName}</Typography>
                  <Typography noWrap sx={{ fontSize: 13, color: chat.id === activeChatId ? 'white' : 'text.secondary' }}>{chat.lastMessage}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Окно диалога */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {activeChat?.userPhoto ? <img src={activeChat.userPhoto} alt={activeChat.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : activeChat?.userName[0]}
              </Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>{activeChat?.userName}</Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Закрыть чат" tabIndex={0}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {activeChat?.messages.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>Нет сообщений</Typography>
            )}
            {activeChat?.messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.800',
                  color: msg.sender === 'user' ? 'white' : 'grey.100',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  px: 2,
                  py: 1,
                  maxWidth: '80%',
                  mb: 0.5,
                  fontSize: 16,
                  boxShadow: 1,
                }}
              >
                {msg.text}
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onSend(inputValue); }}
              placeholder="Введите сообщение..."
              style={{ flex: 1, borderRadius: 18, border: '1px solid #444', padding: '10px 16px', fontSize: 16, outline: 'none', background: 'inherit', color: 'inherit' }}
              aria-label="Введите сообщение"
            />
            <Button variant="contained" onClick={() => onSend(inputValue)} disabled={!inputValue.trim()} sx={{ borderRadius: 18, minWidth: 0, px: 3 }}>Отправить</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const mockChats: Chat[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Тимур Бабенко',
    userPhoto: 'https://images2.novochag.ru/upload/img_cache/358/358a335d28cb3ebefa84f477c1c0e05e_cropped_666x781.jpg',
    lastMessage: 'Здравствуйте! Чем могу помочь?',
    lastMessageTime: '12:00',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'professional', text: 'Здравствуйте! Чем могу помочь?', timestamp: '12:00', isRead: true },
    ],
  },
  {
    id: 2,
    userId: 2,
    userName: 'Анна Сидорова',
    userPhoto: '',
    lastMessage: 'Спасибо за информацию!',
    lastMessageTime: '13:00',
    unreadCount: 0,
    messages: [
      { id: 2, sender: 'user', text: 'Добрый день! Интересует съёмка рекламы.', timestamp: '13:00', isRead: true },
      { id: 3, sender: 'professional', text: 'Спасибо за информацию!', timestamp: '13:05', isRead: true },
    ],
  },
  {
    id: 3,
    userId: 3,
    userName: 'Алексей Кузнецов',
    userPhoto: '',
    lastMessage: 'Ок, договорились!',
    lastMessageTime: '14:00',
    unreadCount: 0,
    messages: [
      { id: 4, sender: 'professional', text: 'Ок, договорились!', timestamp: '14:00', isRead: true },
    ],
  },
];

const ProfessionalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [professional, setProfessional] = useState<ProfessionalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<number>(mockChats[0].id);
  const [inputValue, setInputValue] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProfessional = async () => {
        setLoading(true);
        setError('');
        
        try {
          // Обрабатываем особый случай с Тимуром Бабенко
          if (id === 'timur-babenko') {
            setProfessional({
              id: 999,
              userId: 999,
              name: 'Тимур Бабенко',
              profession: 'Оператор',
              rating: 4.8,
              experience: '8 лет',
              location: 'Москва',
              photo: 'https://images2.novochag.ru/upload/img_cache/358/358a335d28cb3ebefa84f477c1c0e05e_cropped_666x781.jpg',
              biography: 'Профессиональный оператор с опытом работы более 8 лет. Специализируюсь на съемках художественных фильмов и рекламных роликов. Работал на проектах для крупных брендов.',
              reviews: [
                { id: 1, rating: 5, text: 'Отличный специалист!', reviewerName: 'Иван Петров', createdAt: '2023-05-15' },
                { id: 2, rating: 4.5, text: 'Хорошая работа, рекомендую.', reviewerName: 'Мария Сидорова', createdAt: '2023-04-20' }
              ],
              reviewsCount: 2
            });
            setLoading(false);
            return;
          }
          
          // Загружаем данные из API
          const response = await fetch(`/api/professionals/${id}`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить данные специалиста');
          }
          
          const data = await response.json();
          setProfessional(data);
        } catch (err) {
          console.error('Ошибка при загрузке данных специалиста:', err);
          setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProfessional();
    }
  }, [id]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, { id: Date.now(), sender: 'user', text, timestamp: new Date().toISOString(), isRead: false }], lastMessage: text }
        : chat
    ));
    setInputValue('');
  };

  // Отзывы — слайдер
  const renderReviews = () => {
    if (!professional || !professional.reviews || professional.reviews.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          У этого специалиста пока нет отзывов.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1 }}>
        {professional.reviews.map((review) => (
          <ReviewCard key={review.id}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {review.text || 'Без комментария'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ color: 'yellow', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{review.rating}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {review.reviewerName}
              </Typography>
            </Box>
          </ReviewCard>
        ))}
      </Box>
    );
  };

  // Функция для обновления данных после добавления отзыва
  const handleReviewAdded = async () => {
    if (id) {
      setLoading(true);
      try {
        const response = await fetch(`/api/professionals/${id}`);
        if (!response.ok) {
          throw new Error('Не удалось обновить данные специалиста');
        }
        const data = await response.json();
        setProfessional(data);
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFavoriteClick = async () => {
    if (professional) {
      const wasInFavorites = isFavorite(professional.id);
      
      // Сначала добавляем/удаляем из избранного
      toggleFavorite(professional.id);
      
      // Если профессионал НЕ был в избранном (т.е. мы его добавляем), показываем модальное окно
      if (!wasInFavorites) {
        setIsModalOpen(true);
      } else {
        // Если профессионал БЫЛ в избранном (т.е. мы его удаляем), удаляем его из всех списков
        try {
          // Получим токен из localStorage
          const token = localStorage.getItem('token');
          if (token) {
            // Сначала получаем все списки пользователя
            const listsResponse = await fetch('/api/participants', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (listsResponse.ok) {
              const lists = await listsResponse.json();
              
              // Для каждого списка, в котором есть этот профессионал, удаляем его
              for (const list of lists) {
                if (list.list_of_ids.includes(professional.id)) {
                  await fetch(`/api/participants/${list.id}/professionals/${professional.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error('Ошибка при удалении профессионала из списков:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!professional) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Специалист не найден'}</Alert>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Вернуться к списку
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Верхняя панель */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ position: 'absolute', left: 16 }}
          aria-label="Назад"
          tabIndex={0}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
          Профиль
        </Typography>
      </Box>

      {/* Показываем сообщение об ошибке, если есть */}
      {error && (
        <Container>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Компактный блок с фото и инфо */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 3, pt: 2, pb: 1 }}>
        <CompactPhoto sx={{ backgroundImage: `url(${professional.photo})` }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {professional.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography color="text.secondary">
              {professional.location}
            </Typography>
            <Typography color="text.secondary">•</Typography>
            <Typography color="text.secondary">
              {professional.profession}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Биография */}
      <Box sx={{ px: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Биография
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 15 }}>
          {professional.biography}
        </Typography>
      </Box>

      {/* Отзывы — слайдер */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Отзывы
          </Typography>
          {professional && professional.rating !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', px: 1.5, py: 0.5, borderRadius: 2 }}>
              <StarIcon sx={{ color: 'yellow', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{professional.rating}</Typography>
              {professional.reviewsCount && (
                <Typography variant="caption" color="text.secondary">
                  ({professional.reviewsCount})
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {renderReviews()}
        
        {/* Форма для добавления отзыва */}
        {professional && (
          <ReviewForm 
            professionalId={professional.id} 
            professionalName={professional.name}
            userId={professional.userId}
            onReviewAdded={handleReviewAdded}
          />
        )}
      </Box>

      {/* Примеры работ */}
      <Box sx={{ px: 3, pt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Примеры работ
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '10px',
          }}
        >
          {mockProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectImage style={{ backgroundImage: `url(${project.image})` }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </Box>
            </ProjectCard>
          ))}
        </Box>
      </Box>

      {/* Кнопки действий */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        bgcolor: 'background.default', 
        borderTop: 1, 
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<MessageIcon />}
            tabIndex={0}
            aria-label="Написать сообщение"
            onClick={() => setIsChatOpen(true)}
          >
            Написать
          </Button>
          <IconButton 
            onClick={handleFavoriteClick}
            sx={{ 
              p: 1.5, 
              bgcolor: isFavorite(professional.id) ? 'error.main' : 'action.hover',
              color: isFavorite(professional.id) ? 'white' : 'action.active',
              borderRadius: 1
            }}
            tabIndex={0}
            aria-label={isFavorite(professional.id) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite(professional.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>
      <ChatWindow
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onSend={handleSend}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      
      {professional && (
        <FavoriteListModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          professionalId={professional.id}
          professionalName={professional.name}
        />
      )}
    </Box>
  );
};

export default ProfessionalDetailPage; 