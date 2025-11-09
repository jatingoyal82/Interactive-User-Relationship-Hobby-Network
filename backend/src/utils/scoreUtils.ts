import { IUser } from '../models/User';
import { User } from '../models/User';

/**
 * Calculate popularity score for a user
 * Formula: numUniqueFriends + (sharedHobbies * 0.5)
 * 
 * Shared hobbies = hobbies that are also present in at least one friend's hobbies
 */
export const calculatePopularityScore = async (userId: string): Promise<number> => {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return 0;
    }

    const numUniqueFriends = user.friends.length;

    // Calculate shared hobbies
    if (user.friends.length === 0) {
      return numUniqueFriends;
    }

    const friends = await User.find({ id: { $in: user.friends } });
    const friendHobbiesSet = new Set<string>();
    
    friends.forEach((friend) => {
      friend.hobbies.forEach((hobby) => friendHobbiesSet.add(hobby));
    });

    const sharedHobbies = user.hobbies.filter((hobby) => 
      friendHobbiesSet.has(hobby)
    ).length;

    return numUniqueFriends + (sharedHobbies * 0.5);
  } catch (error) {
    console.error('Error calculating popularity score:', error);
    return 0;
  }
};

/**
 * Recalculate and update popularity score for a user
 */
export const updatePopularityScore = async (userId: string): Promise<number> => {
  const score = await calculatePopularityScore(userId);
  await User.updateOne({ id: userId }, { popularityScore: score });
  return score;
};

/**
 * Recalculate popularity scores for multiple users
 */
export const updatePopularityScores = async (userIds: string[]): Promise<void> => {
  await Promise.all(userIds.map((id) => updatePopularityScore(id)));
};

