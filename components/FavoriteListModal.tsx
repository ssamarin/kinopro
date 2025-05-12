"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "./ui/dialog";

interface FavoriteList {
  id: number;
  title: string;
  description: string;
  list_of_ids: number[];
}

interface FavoriteListModalProps {
  open: boolean;
  onClose: () => void;
  professionalId: number;
  professionalName: string;
}

const FavoriteListModal: React.FC<FavoriteListModalProps> = ({
  open,
  onClose,
  professionalId,
  professionalName
}) => {
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  // Загрузка списков избранного
  useEffect(() => {
    if (open) {
      fetchLists();
    }
  }, [open]);

  const fetchLists = async () => {
    setLoading(true);
    setError("");
    
    try {
      // В реальном приложении здесь должен быть запрос к API
      // Имитация загрузки данных
      setTimeout(() => {
        setLists([
          {
            id: 1,
            title: "Операторы",
            description: "Список лучших операторов",
            list_of_ids: [2, 3, 5]
          },
          {
            id: 2,
            title: "Для нового проекта",
            description: "Специалисты для съемки рекламного ролика",
            list_of_ids: [1, 4]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Ошибка при загрузке списков избранного");
      setLoading(false);
    }
  };

  // Создание нового списка избранного
  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      setError("Название списка обязательно");
      return;
    }
    
    setCreatingList(true);
    setError("");
    
    try {
      // В реальном приложении здесь должен быть запрос к API
      // Имитация создания списка
      setTimeout(() => {
        const newList = {
          id: Date.now(),
          title: newListTitle.trim(),
          description: newListDescription.trim(),
          list_of_ids: [professionalId]
        };
        
        setLists(prev => [newList, ...prev]);
        setShowCreateForm(false);
        setNewListTitle("");
        setNewListDescription("");
        setSuccess(`Профессионал ${professionalName} добавлен в новый список "${newListTitle}"`);
        setCreatingList(false);
        
        // Сбрасываем сообщение об успехе через 3 секунды
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }, 1000);
    } catch (err) {
      setError("Ошибка при создании списка");
      setCreatingList(false);
    }
  };

  // Добавление профессионала в существующий список
  const handleAddToList = async (listId: number, listTitle: string) => {
    setAddingToList(true);
    setError("");
    
    try {
      // В реальном приложении здесь должен быть запрос к API
      // Имитация добавления в список
      setTimeout(() => {
        setSuccess(`Профессионал ${professionalName} добавлен в список "${listTitle}"`);
        setAddingToList(false);
        
        // Сбрасываем сообщение об успехе через 3 секунды
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 3000);
      }, 1000);
    } catch (err) {
      setError("Ошибка при добавлении в список");
      setAddingToList(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить в избранное</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 text-green-500 p-3 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <div className="py-2">
          <p className="text-sm text-gray-400 mb-4">
            Добавить профессионала {professionalName} в список:
          </p>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {!showCreateForm && (
                <button
                  className="flex items-center justify-center w-full py-3 mb-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => setShowCreateForm(true)}
                  tabIndex={0}
                  aria-label="Создать новый список"
                >
                  <Plus size={16} className="mr-2" />
                  <span>Создать новый список</span>
                </button>
              )}
              
              {showCreateForm && (
                <div className="border border-gray-800 rounded-md p-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Создать новый список</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="list-title" className="block text-xs mb-1 text-gray-400">
                        Название списка*
                      </label>
                      <input
                        id="list-title"
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        className="w-full rounded-md bg-gray-800 border border-gray-700 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="list-description" className="block text-xs mb-1 text-gray-400">
                        Описание (необязательно)
                      </label>
                      <textarea
                        id="list-description"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        className="w-full rounded-md bg-gray-800 border border-gray-700 p-2 text-sm h-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        className="px-3 py-1.5 text-sm text-gray-300 hover:text-white"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewListTitle("");
                          setNewListDescription("");
                        }}
                        tabIndex={0}
                      >
                        Отмена
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={handleCreateList}
                        disabled={creatingList || !newListTitle.trim()}
                        tabIndex={0}
                      >
                        {creatingList ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Создать"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {lists.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Ваши списки</h3>
                  {lists.map(list => (
                    <div 
                      key={list.id} 
                      className="flex justify-between items-center p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-sm">{list.title}</h4>
                        {list.description && (
                          <p className="text-xs text-gray-400 mt-1">{list.description}</p>
                        )}
                      </div>
                      <button
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => handleAddToList(list.id, list.title)}
                        disabled={addingToList}
                        tabIndex={0}
                        aria-label={`Добавить в список ${list.title}`}
                      >
                        Добавить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет списков избранного
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteListModal; 