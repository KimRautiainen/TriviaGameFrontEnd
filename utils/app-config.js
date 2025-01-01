// Custom Backend API URLs
const apiUrl = 'http://192.168.101.205:3000/'; // Base api url
// Lapotop IP:
//const apiUrl = 'http://192.168.0.101:3000/';

const authUrl = apiUrl + 'auth/';
const mediaUrl = apiUrl + 'uploads/';

// URLs for the Open Trivia Database API
const categoryUrl = 'https://opentdb.com/api_category.php'; // Open trivia database category URL
const triviaUrl = 'https://opentdb.com/api.php?'; // Open trivia database API URL

// Websocket server url
const serverUrl = 'ws://192.168.101.205:3000';

export {triviaUrl, apiUrl, authUrl, mediaUrl, categoryUrl, serverUrl};
