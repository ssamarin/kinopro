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
  
  const handleFavoriteClick = () => {
    setIsModalOpen(true);
  };
  
  const handleMessage = () => {
    // Логика для отправки сообщения
    console.log("Отправка сообщения");
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Верхняя панель */}
      <div className="p-4 flex items-center relative">
        <button 
          onClick={handleBack} 
          className="absolute left-4 p-2 rounded-full" 
          aria-label="Назад"
          tabIndex={0}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold w-full text-center">Профиль</h1>
      </div>
      
      {/* Информация о профессионале */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Тимур Бабенко</h2>
          <h3 className="text-xl text-gray-400">Оператор</h3>
          <p className="text-gray-400 mt-1">Москва</p>
        </div>
        <div className="relative w-24 h-24 overflow-hidden rounded-2xl">
          <Image 
            src="/professional-avatar.jpg" 
            alt="Тимур Бабенко" 
            fill 
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Биография */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold mb-2">Биография</h3>
        <p className="text-gray-300">
          Профессиональный оператор с опытом работы более 8 лет. Специализируюсь на съемках 
          художественных фильмов и рекламных роликов. Работал на проектах для крупных брендов.
        </p>
      </div>
      
      {/* Примеры работ */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold mb-2">Примеры работ</h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {/* Примеры работ разного формата */}
            <div className="min-w-[200px] h-[300px] relative rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image src="/work-sample-1.jpg" alt="Пример работы" fill className="object-cover" />
            </div>
            <div className="min-w-[300px] h-[200px] relative rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white">Видео</span>
              </div>
            </div>
            <div className="min-w-[200px] h-[300px] relative rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image src="/work-sample-2.jpg" alt="Пример работы" fill className="object-cover" />
            </div>
            <div className="min-w-[300px] h-[200px] relative rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image src="/work-sample-3.jpg" alt="Пример работы" fill className="object-cover" />
            </div>
            <div className="min-w-[200px] h-[250px] relative rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white">Видео</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Рейтинг и отзывы */}
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