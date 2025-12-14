const questMock = {
  quests: [
    {
      quest_id: 1,
      name: 'Daily Brain Teaser',
      description: 'Solve 5 trivia questions correctly.',
      type: 'daily',
      requirements: {answered: 5},
      reward: '50 Coins',
      created_at: '2024-02-09T00:00:00Z',
      expires_at: '2024-02-10T00:00:00Z',
    },
    {
      quest_id: 2,
      name: 'Weekly Knowledge Hunt',
      description: 'Win 3 trivia matches this week.',
      type: 'weekly',
      requirements: {wins: 3},
      reward: '150 Coins',
      created_at: '2024-02-05T00:00:00Z',
      expires_at: '2024-02-12T00:00:00Z',
    },
    {
      quest_id: 3,
      name: 'Monthly Trivia Master',
      description: 'Play at least 50 trivia rounds in a month.',
      type: 'monthly',
      requirements: {played: 50},
      reward: '500 Coins',
      created_at: '2024-02-01T00:00:00Z',
      expires_at: '2024-03-01T00:00:00Z',
    },
  ],

  user_quests: [
    {
      id: 101,
      user_id: 1,
      quest_id: 1,
      progress: {answered: 3}, // User has answered 3 out of 5
      completed: false,
      completion_date: null,
      created_at: '2024-02-09T08:00:00Z',
      updated_at: '2024-02-09T10:00:00Z',
    },
    {
      id: 102,
      user_id: 1,
      quest_id: 2,
      progress: {wins: 2}, // User has won 2 out of 3 matches
      completed: false,
      completion_date: null,
      created_at: '2024-02-05T10:00:00Z',
      updated_at: '2024-02-09T14:00:00Z',
    },
  ],
};

export default questMock;
