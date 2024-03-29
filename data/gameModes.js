const gameModes = [
  {
    title: 'Classic',
    description: 'Classic trivia mode',
    detailedDescription:
      'In Classic mode, you will answer a series of questions from a wide range of categories. There is no time limit, allowing you to think through each question carefully. Perfect for those who love traditional trivia!',
    image: require('../assets/images/pixelHouse.png'),
  },
  {
    title: 'Timed',
    description: 'Answer before time runs out!',
    detailedDescription:
      'Timed mode adds a thrilling twist to the classic trivia experience. Each question comes with a countdown. Answer quickly to earn bonus points, but be careful, wrong answers may cost you!',
    image: require('../assets/images/timedRace.jpg'),
  },
  {
    title: 'Survival',
    description:
      'Face a continuous stream of questions and must answer correctly to proceed.',
    detailedDescription:
      'Survival mode tests your trivia endurance. Answer questions correctly to stay in the game. One wrong answer, and you start over. How long can you survive?',
    image: require('../assets/images/survivalCamping.jpg'),
  },
  {
    title: 'Ranked',
    description: 'Compete against other players',
    detailedDescription:
      'Ranked mode pits you against players from around the globe. Climb the leaderboards by answering questions correctly and quickly. Can you reach the top and become a trivia champion?',
    image: require('../assets/images/rankedChess.png'),
  },
  {
    title: 'Categories',
    description: 'Choose a category to play',
    detailedDescription:
      'Prefer to stick to your strengths? Categories mode lets you choose your favorite trivia topics. From science to sports, customize your trivia experience to suit your interests.',
    image: require('../assets/images/categoriesBooks.png'),
  },
  {
    title: 'Tournament',
    description: 'Only one winner!',
    detailedDescription:
      'Tournament mode is for the competitive spirit. Enter into a series of rounds where only the top scorers advance. Do you have what it takes to outlast your competitors and take home the crown?',
    image: require('../assets/images/tournamentGladiators.jpg'),
  },
];
export default gameModes;
