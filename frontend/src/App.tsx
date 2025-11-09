import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import GraphView from './components/GraphView';
import Sidebar from './components/Sidebar';
import UserPanel from './components/UserPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { userApi, graphApi, User, CreateUserData, UpdateUserData, GraphData } from './api/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const queryClientInner = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });

  // Fetch graph data
  const { data: graphData, isLoading: graphLoading } = useQuery<GraphData>({
    queryKey: ['graph'],
    queryFn: graphApi.getGraphData,
    refetchInterval: 2000, // Refetch every 2 seconds for live updates
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserData) => userApi.create(data),
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      setShowUserPanel(false);
      setIsCreating(false);
      toast.success('User created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      setShowUserPanel(false);
      setSelectedUser(null);
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to update user');
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      setShowUserPanel(false);
      setSelectedUser(null);
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      if (error.response?.status === 409) {
        toast.error('Cannot delete user with active friendships. Remove all friendships first.');
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to delete user');
      }
    },
  });

  // Link users mutation
  const linkUsersMutation = useMutation({
    mutationFn: ({ id, friendId }: { id: string; friendId: string }) =>
      userApi.link(id, friendId),
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      toast.success('Friendship created!');
    },
    onError: (error: any) => {
      console.error('Error linking users:', error);
      if (error.response?.status === 409) {
        toast.error('Friendship already exists');
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to create friendship');
      }
    },
  });

  // Unlink users mutation
  const unlinkUsersMutation = useMutation({
    mutationFn: ({ id, friendId }: { id: string; friendId: string }) =>
      userApi.unlink(id, friendId),
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      toast.success('Friendship removed!');
    },
    onError: (error: any) => {
      console.error('Error unlinking users:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to remove friendship');
    },
  });

  // Add hobby to user mutation
  const addHobbyMutation = useMutation({
    mutationFn: ({ id, hobby }: { id: string; hobby: string }) => {
      const user = users.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      const updatedHobbies = [...user.hobbies, hobby];
      return userApi.update(id, { hobbies: updatedHobbies });
    },
    onSuccess: () => {
      queryClientInner.invalidateQueries({ queryKey: ['users'] });
      queryClientInner.invalidateQueries({ queryKey: ['graph'] });
      toast.success('Hobby added!');
    },
    onError: (error: any) => {
      console.error('Error adding hobby:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to add hobby');
    },
  });

  const handleNodeDrop = useCallback(
    (targetNodeId: string, sourceNodeId: string) => {
      if (targetNodeId !== sourceNodeId) {
        linkUsersMutation.mutate(
          { id: sourceNodeId, friendId: targetNodeId },
          {
            onSuccess: () => {
              // Success handled by mutation
            },
            onError: (error: any) => {
              if (error.response?.status === 409) {
                // Friendship already exists, try unlinking instead
                unlinkUsersMutation.mutate({
                  id: sourceNodeId,
                  friendId: targetNodeId,
                });
              }
            },
          }
        );
      }
    },
    [linkUsersMutation, unlinkUsersMutation]
  );

  const handleHobbyDrop = useCallback(
    (nodeId: string, hobby: string) => {
      const user = users.find((u) => u.id === nodeId);
      if (user && !user.hobbies.includes(hobby)) {
        addHobbyMutation.mutate({ id: nodeId, hobby });
      }
    },
    [users, addHobbyMutation]
  );

  const handleNodeClick = useCallback((nodeId: string) => {
    const user = users.find((u) => u.id === nodeId);
    if (user) {
      setSelectedUser(user);
      setIsCreating(false);
      setShowUserPanel(true);
    }
  }, [users]);

  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
    setIsCreating(false);
    setShowUserPanel(true);
  }, []);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setIsCreating(true);
    setShowUserPanel(true);
  }, []);

  const handleSaveUser = useCallback(
    async (data: CreateUserData | UpdateUserData) => {
      if (isCreating) {
        await createUserMutation.mutateAsync(data as CreateUserData);
      } else if (selectedUser) {
        await updateUserMutation.mutateAsync({
          id: selectedUser.id,
          data,
        });
      }
    },
    [isCreating, selectedUser, createUserMutation, updateUserMutation]
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      await deleteUserMutation.mutateAsync(id);
    },
    [deleteUserMutation]
  );

  const handleClosePanel = useCallback(() => {
    setShowUserPanel(false);
    setSelectedUser(null);
    setIsCreating(false);
  }, []);

  if (usersLoading || graphLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex">
      <Sidebar
        users={users}
        onHobbyDragStart={() => {}}
        onHobbyDragEnd={() => {}}
        onUserSelect={handleUserSelect}
        selectedUser={selectedUser}
      />

      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-lg"
          >
            + Create User
          </button>
        </div>

        {graphData && (
          <GraphView
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeDrop={handleNodeDrop}
            onHobbyDrop={handleHobbyDrop}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      {showUserPanel && (
        <UserPanel
          user={selectedUser}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
          onClose={handleClosePanel}
          isCreating={isCreating}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

