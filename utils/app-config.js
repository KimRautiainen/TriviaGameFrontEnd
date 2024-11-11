// Custom Backend API URLs
//const apiUrl = 'http://192.168.101.205:3000/'; // Base api url
// Lapotop IP:
const apiUrl = 'http://172.20.10.3:3000/';

const authUrl = apiUrl + 'auth/';
const mediaUrl = apiUrl + 'uploads/';

// URLs for the Open Trivia Database API
const categoryUrl = 'https://opentdb.com/api_category.php'; // Open trivia database category URL
const triviaUrl = 'https://opentdb.com/api.php?'; // Open trivia database API URL

export {triviaUrl, apiUrl, authUrl, mediaUrl, categoryUrl};
