import {apiUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';

// Hooks for managing friends
const useFriends = () => {
  // Send friend request with friends userId
  const sendFriendRequest = async (friendId, token) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(
        apiUrl + 'friends/requestFriend/' + friendId,
        options,
      );
    } catch (error) {
      throw new Error('Error sending friend request', error.message);
    }
  };

  // Get friend requests thats status is pending
  const getFriendRequests = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(apiUrl + 'friends/pendingRequests', options);
    } catch (error) {
      throw new Error('Error fetching friend requests', error.message);
    }
  };

  // Respond to friend request with enum status: 'pending', 'accepted', 'rejected'
  const respondFriendRequest = async (friendId, status, token) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(status),
    };
    try {
      return await doFetch(
        apiUrl + 'friends/respondFriend/' + friendId,
        options,
      );
    } catch (error) {
      throw new Error('Error responding to friend request', error.message);
    }
  };

  // remove friend from your list of friends
  const removeFriend = async (friendId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(
        apiUrl + 'friends/deleteFriend/' + friendId,
        options,
      );
    } catch (error) {
      throw new Error('Error deleting friend', error.message);
    }
  };

  // Get friends from you friend list
  const getFriends = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(apiUrl + 'friends/getFriends', options);
    } catch (error) {
      throw new Error('Error getting friends list ', error.message);
    }
  };

  return {
    sendFriendRequest,
    getFriendRequests,
    respondFriendRequest,
    removeFriend,
    getFriends,
  };
};
export {useFriends};
