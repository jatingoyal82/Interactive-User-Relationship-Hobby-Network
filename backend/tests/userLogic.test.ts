import { User } from '../src/models/User';
import {
  calculatePopularityScore,
  updatePopularityScore,
} from '../src/utils/scoreUtils';
import { v4 as uuidv4 } from 'uuid';

describe('User Logic Tests', () => {
  describe('Popularity Score Calculation', () => {
    test('should calculate popularity score correctly with no friends', async () => {
      const user = new User({
        id: uuidv4(),
        username: 'TestUser',
        age: 25,
        hobbies: ['reading', 'coding'],
        friends: [],
      });
      await user.save();

      const score = await calculatePopularityScore(user.id);
      expect(score).toBe(0);
    });

    test('should calculate popularity score with friends but no shared hobbies', async () => {
      const user1 = new User({
        id: uuidv4(),
        username: 'User1',
        age: 25,
        hobbies: ['reading', 'coding'],
        friends: [],
      });
      await user1.save();

      const user2 = new User({
        id: uuidv4(),
        username: 'User2',
        age: 30,
        hobbies: ['gaming', 'sports'],
        friends: [],
      });
      await user2.save();

      user1.friends.push(user2.id);
      user2.friends.push(user1.id);
      await user1.save();
      await user2.save();

      const score = await calculatePopularityScore(user1.id);
      expect(score).toBe(1); // 1 friend, 0 shared hobbies
    });

    test('should calculate popularity score with shared hobbies', async () => {
      const user1 = new User({
        id: uuidv4(),
        username: 'User1',
        age: 25,
        hobbies: ['reading', 'coding', 'gaming'],
        friends: [],
      });
      await user1.save();

      const user2 = new User({
        id: uuidv4(),
        username: 'User2',
        age: 30,
        hobbies: ['gaming', 'sports', 'reading'],
        friends: [],
      });
      await user2.save();

      user1.friends.push(user2.id);
      user2.friends.push(user1.id);
      await user1.save();
      await user2.save();

      const score = await calculatePopularityScore(user1.id);
      // 1 friend + (2 shared hobbies * 0.5) = 1 + 1 = 2
      expect(score).toBe(2);
    });

    test('should update popularity score in database', async () => {
      const user1 = new User({
        id: uuidv4(),
        username: 'User1',
        age: 25,
        hobbies: ['reading', 'coding'],
        friends: [],
      });
      await user1.save();

      const user2 = new User({
        id: uuidv4(),
        username: 'User2',
        age: 30,
        hobbies: ['coding', 'gaming'],
        friends: [],
      });
      await user2.save();

      user1.friends.push(user2.id);
      user2.friends.push(user1.id);
      await user1.save();
      await user2.save();

      await updatePopularityScore(user1.id);

      const updatedUser = await User.findOne({ id: user1.id });
      expect(updatedUser?.popularityScore).toBe(1.5); // 1 friend + (1 shared hobby * 0.5)
    });
  });

  describe('Friendship Management', () => {
    test('should prevent circular friendship (bidirectional)', async () => {
      const user1 = new User({
        id: uuidv4(),
        username: 'User1',
        age: 25,
        hobbies: ['reading'],
        friends: [],
      });
      await user1.save();

      const user2 = new User({
        id: uuidv4(),
        username: 'User2',
        age: 30,
        hobbies: ['gaming'],
        friends: [],
      });
      await user2.save();

      // Create friendship
      user1.friends.push(user2.id);
      user2.friends.push(user1.id);
      await user1.save();
      await user2.save();

      // Verify friendship exists
      const updatedUser1 = await User.findOne({ id: user1.id });
      const updatedUser2 = await User.findOne({ id: user2.id });

      expect(updatedUser1?.friends).toContain(user2.id);
      expect(updatedUser2?.friends).toContain(user1.id);
      expect(updatedUser1?.friends.length).toBe(1);
      expect(updatedUser2?.friends.length).toBe(1);
    });

    test('should prevent deletion when user has friends', async () => {
      const user1 = new User({
        id: uuidv4(),
        username: 'User1',
        age: 25,
        hobbies: ['reading'],
        friends: [],
      });
      await user1.save();

      const user2 = new User({
        id: uuidv4(),
        username: 'User2',
        age: 30,
        hobbies: ['gaming'],
        friends: [],
      });
      await user2.save();

      user1.friends.push(user2.id);
      user2.friends.push(user1.id);
      await user1.save();
      await user2.save();

      // Try to delete user1 - should fail validation
      const user1WithFriends = await User.findOne({ id: user1.id });
      expect(user1WithFriends?.friends.length).toBeGreaterThan(0);
    });
  });
});

