import React, { useState, useMemo } from 'react';
import { User } from '../api/api';

interface SidebarProps {
  users: User[];
  onHobbyDragStart: (hobby: string) => void;
  onHobbyDragEnd: () => void;
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  users,
  onHobbyDragStart,
  onHobbyDragEnd,
  onUserSelect,
  selectedUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all unique hobbies from all users
  const allHobbies = useMemo(() => {
    const hobbySet = new Set<string>();
    users.forEach((user) => {
      user.hobbies.forEach((hobby) => hobbySet.add(hobby));
    });
    return Array.from(hobbySet).sort();
  }, [users]);

  const filteredHobbies = useMemo(() => {
    if (!searchTerm) return allHobbies;
    return allHobbies.filter((hobby) =>
      hobby.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allHobbies, searchTerm]);

  const handleDragStart = (e: React.DragEvent, hobby: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('hobby', hobby);
    onHobbyDragStart(hobby);
    
    // Dispatch custom event for graph view
    window.dispatchEvent(
      new CustomEvent('hobby-drag-start', { detail: { hobby } })
    );
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onHobbyDragEnd();
    
    // Check if dropped on a node
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const nodeElement = element?.closest('.react-flow__node');
    if (nodeElement) {
      const nodeId = nodeElement.getAttribute('data-id');
      if (nodeId) {
        window.dispatchEvent(
          new CustomEvent('hobby-drop', { detail: { nodeId } })
        );
      }
    }
  };

  return (
    <div className="w-80 bg-gray-100 border-r border-gray-300 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hobbies</h2>
        <input
          type="text"
          placeholder="Search hobbies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2">
          {filteredHobbies.length > 0 ? (
            filteredHobbies.map((hobby) => (
              <div
                key={hobby}
                draggable
                onDragStart={(e) => handleDragStart(e, hobby)}
                onDragEnd={(e) => handleDragEnd(e)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full cursor-move hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
              >
                {hobby}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hobbies found</p>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Users</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm opacity-75">
                Age: {user.age} | Score: {user.popularityScore.toFixed(1)}
              </div>
              <div className="text-xs mt-1">
                {user.hobbies.length} hobby{user.hobbies.length !== 1 ? 'ies' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

