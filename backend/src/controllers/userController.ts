import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import {
  calculatePopularityScore,
  updatePopularityScore,
  updatePopularityScores,
} from '../utils/scoreUtils';
import { AppError } from '../middleware/errorHandler';

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get single user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Create user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, age, hobbies } = req.body;

    if (!username || !age) {
      const error: AppError = new Error('Username and age are required');
      error.statusCode = 400;
      return next(error);
    }

    if (typeof age !== 'number' || age < 1 || age > 150) {
      const error: AppError = new Error('Age must be a number between 1 and 150');
      error.statusCode = 400;
      return next(error);
    }

    const userData: Partial<IUser> = {
      id: uuidv4(),
      username: username.trim(),
      age,
      hobbies: Array.isArray(hobbies) ? hobbies.filter((h: string) => h.trim()) : [],
      friends: [],
      popularityScore: 0,
    };

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMsg: AppError = new Error(error.message);
      errorMsg.statusCode = 400;
      return next(errorMsg);
    }
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, age, hobbies } = req.body;

    const user = await User.findOne({ id });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    if (username !== undefined) {
      user.username = username.trim();
    }

    if (age !== undefined) {
      if (typeof age !== 'number' || age < 1 || age > 150) {
        const error: AppError = new Error('Age must be a number between 1 and 150');
        error.statusCode = 400;
        return next(error);
      }
      user.age = age;
    }

    if (hobbies !== undefined) {
      if (!Array.isArray(hobbies)) {
        const error: AppError = new Error('Hobbies must be an array');
        error.statusCode = 400;
        return next(error);
      }
      user.hobbies = hobbies.filter((h: string) => h && h.trim());
    }

    await user.save();

    // Recalculate popularity score after update
    await updatePopularityScore(id);
    // Also update friends' scores if hobbies changed
    if (hobbies !== undefined && user.friends.length > 0) {
      await updatePopularityScores(user.friends);
    }

    const updatedUser = await User.findOne({ id });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMsg: AppError = new Error(error.message);
      errorMsg.statusCode = 400;
      return next(errorMsg);
    }
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Prevent deletion if user has friends
    if (user.friends.length > 0) {
      const error: AppError = new Error(
        'Cannot delete user with active friendships. Please remove all friendships first.'
      );
      error.statusCode = 409;
      return next(error);
    }

    // Remove this user from other users' friends lists
    await User.updateMany(
      { friends: id },
      { $pull: { friends: id } }
    );

    await User.deleteOne({ id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Link two users (create friendship)
export const linkUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (!friendId) {
      const error: AppError = new Error('friendId is required');
      error.statusCode = 400;
      return next(error);
    }

    if (id === friendId) {
      const error: AppError = new Error('User cannot be friends with themselves');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ id });
    const friend = await User.findOne({ id: friendId });

    if (!user || !friend) {
      const error: AppError = new Error('One or both users not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if friendship already exists (bidirectional check)
    if (user.friends.includes(friendId) || friend.friends.includes(id)) {
      const error: AppError = new Error('Friendship already exists');
      error.statusCode = 409;
      return next(error);
    }

    // Add bidirectional friendship
    user.friends.push(friendId);
    friend.friends.push(id);

    await user.save();
    await friend.save();

    // Recalculate popularity scores for both users
    await updatePopularityScores([id, friendId]);

    const updatedUser = await User.findOne({ id });
    const updatedFriend = await User.findOne({ id: friendId });

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        friend: updatedFriend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Unlink two users (remove friendship)
export const unlinkUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (!friendId) {
      const error: AppError = new Error('friendId is required');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ id });
    const friend = await User.findOne({ id: friendId });

    if (!user || !friend) {
      const error: AppError = new Error('One or both users not found');
      error.statusCode = 404;
      return next(error);
    }

    // Remove bidirectional friendship
    user.friends = user.friends.filter((fid) => fid !== friendId);
    friend.friends = friend.friends.filter((fid) => fid !== id);

    await user.save();
    await friend.save();

    // Recalculate popularity scores for both users
    await updatePopularityScores([id, friendId]);

    const updatedUser = await User.findOne({ id });
    const updatedFriend = await User.findOne({ id: friendId });

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        friend: updatedFriend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get graph data (nodes and edges for React Flow)
export const getGraphData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({});

    const nodes = users.map((user, index) => ({
      id: user.id,
      type: user.popularityScore > 5 ? 'highScoreNode' : 'lowScoreNode',
      position: {
        x: (index % 5) * 200 + 100,
        y: Math.floor(index / 5) * 200 + 100,
      },
      data: {
        label: `${user.username} (${user.age})`,
        username: user.username,
        age: user.age,
        hobbies: user.hobbies,
        popularityScore: user.popularityScore,
      },
    }));

    const edges: Array<{ id: string; source: string; target: string }> = [];
    const edgeSet = new Set<string>();

    users.forEach((user) => {
      user.friends.forEach((friendId) => {
        // Create unique edge ID to prevent duplicates
        const edgeId1 = `${user.id}-${friendId}`;
        const edgeId2 = `${friendId}-${user.id}`;

        if (!edgeSet.has(edgeId1) && !edgeSet.has(edgeId2)) {
          edges.push({
            id: edgeId1,
            source: user.id,
            target: friendId,
          });
          edgeSet.add(edgeId1);
          edgeSet.add(edgeId2);
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        nodes,
        edges,
      },
    });
  } catch (error) {
    next(error);
  }
};

