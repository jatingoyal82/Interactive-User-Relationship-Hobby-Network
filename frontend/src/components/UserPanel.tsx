import React, { useState, useEffect } from 'react';
import { User, CreateUserData, UpdateUserData } from '../api/api';

interface UserPanelProps {
  user: User | null;
  onSave: (data: CreateUserData | UpdateUserData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
  isCreating: boolean;
}

const UserPanel: React.FC<UserPanelProps> = ({
  user,
  onSave,
  onDelete,
  onClose,
  isCreating,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    age: 25,
    hobbies: [] as string[],
  });
  const [newHobby, setNewHobby] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        age: user.age,
        hobbies: [...user.hobbies],
      });
    } else if (isCreating) {
      setFormData({
        username: '',
        age: 25,
        hobbies: [],
      });
    }
  }, [user, isCreating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleAddHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, newHobby.trim()],
      });
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((h) => h !== hobby),
    });
  };

  const handleDelete = async () => {
    if (user && window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await onDelete(user.id);
        onClose();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-300 flex flex-col h-full">
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {isCreating ? 'Create User' : 'Edit User'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            required
            min="1"
            max="150"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hobbies
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHobby();
                }
              }}
              placeholder="Add hobby..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddHobby}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
              >
                {hobby}
                <button
                  type="button"
                  onClick={() => handleRemoveHobby(hobby)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isCreating ? 'Create' : 'Save'}
          </button>
          {!isCreating && user && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserPanel;

