"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ArrowLeft, Star, MessageCircle } from "lucide-react";
import FavoriteListModal from "../../../components/FavoriteListModal";

export default function ProfessionalPage() {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professional, setProfessional] = useState({
    id: 1, // Здесь нужно получить реальный ID из параметров
    name: "Тимур Бабенко"
  });
  
  const handleBack = () => {
    router.back();
  };
  
  const handleFavoriteClick = async () => {
    const wasInFavorites = isFavorite;
    
    // Сначала меняем состояние избранного
    setIsFavorite(!isFavorite);
    
    // Если профессионал НЕ был в избранном (т.е. мы его добавляем), показываем модальное окно
    if (!wasInFavorites) {
      setIsModalOpen(true);
    } else {
      // Если профессионал БЫЛ в избранном (т.е. мы его удаляем), удаляем его из всех списков
      try {
        // Получим токен из localStorage (если доступно в Next.js)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('token');
        }
        
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
  };
  
  const handleMessage = () => {
    // Логика для отправки сообщения
    console.log("Отправка сообщения");
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Верхняя панель */}
      <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-center bg-black z-10">
        <button 
          onClick={handleBack}
          className="absolute left-4"
          aria-label="Назад"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Профиль специалиста</h1>
      </div>
      
      {/* Основное содержимое */}
      <div className="pt-16 pb-24">
        {/* Фото профиля и имя */}
        <div className="relative h-64 bg-gradient-to-b from-gray-800 to-black">
          <div className="absolute bottom-6 left-6 flex items-end">
            <div className="relative w-20 h-20 mr-4 rounded-full overflow-hidden border-2 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" 
                alt="Фото профиля"
                fill
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{professional.name}</h2>
          </div>
        </div>
        
        {/* Информация о специалисте */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">О специалисте</h3>
            <p className="text-gray-400">
              Опытный кинооператор с более чем 10-летним стажем работы в индустрии. 
              Специализируюсь на художественных фильмах и рекламных роликах. 
              Победитель международных фестивалей в категории "Лучшая операторская работа".
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Опыт работы</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <p className="font-semibold text-white">Оператор-постановщик, студия "Кинолайт"</p>
                <p>2018 - настоящее время</p>
                <p>Руководство съемочным процессом, работа с режиссерами над визуальной концепцией.</p>
              </li>
              <li>
                <p className="font-semibold text-white">Кинооператор, "МосфильмПро"</p>
                <p>2012 - 2018</p>
                <p>Съемка художественных фильмов и сериалов.</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Рейтинг */}
        <div className="px-6 py-4 bg-gray-900 rounded-lg mx-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Рейтинг</h3>
            <div className="flex items-center">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1">4.8</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">На основе 24 отзывов</p>
        </div>
      </div>
      
      {/* Кнопки действий */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800">
        <div className="flex gap-4">
          <button 
            onClick={handleMessage}
            className="flex-1 bg-white text-black py-3 rounded-lg font-semibold"
            tabIndex={0}
            aria-label="Написать сообщение"
          >
            <div className="flex items-center justify-center">
              <MessageCircle size={20} className="mr-2" />
              Написать
            </div>
          </button>
          <button 
            onClick={handleFavoriteClick}
            className={`w-14 ${isFavorite ? 'bg-red-500' : 'bg-gray-800'} rounded-lg flex items-center justify-center`}
            tabIndex={0}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Heart size={24} className={isFavorite ? "fill-white text-white" : "text-white"} />
          </button>
        </div>
      </div>

      <FavoriteListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professionalId={professional.id}
        professionalName={professional.name}
      />
    </div>
  );
} 