import {useContext, useEffect, useState} from 'react';
import {triviaUrl, apiUrl, authUrl, mediaUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';
import {MainContext} from '../contexts/MainContext';

const useAuthentication = () => {
  // Post user body to backend for logging in
  const postLogin = async (user) => {
    return await doFetch(authUrl + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  };

  return {postLogin};
};

const useUser = () => {
  // Award experience points to user
  const awardXp = async (token, xp, userId) => {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({xp}),
    };
    console.log(JSON.stringify({xp}));
    return await doFetch(apiUrl + 'user/' + userId + '/levels', options);
  };
  // Get users details with token
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'user/token', options);
  };
  // Register new user
  const postUser = async (userData, isFormData = false) => {
    const options = {
      method: 'POST',
      headers: isFormData
        ? {} // FormData automatically sets appropriate headers, including boundary
        : {
            'Content-Type': 'application/json',
          },
      body: isFormData ? userData : JSON.stringify(userData),
    };

    return await doFetch(authUrl + 'register', options);
  };

  // Modify user details
  const putUser = async (userData, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(userData),
    };
    return await doFetch(apiUrl + 'users', options);
  };

  // Hook to check from backend if username is available
  const checkUsername = async (username) => {
    try {
      const response = await doFetch(
        `${apiUrl}check/username?username=${username}`,
      );
      return response.available;
    } catch (error) {
      throw new Error('checkUsername Error: ' + error.message);
    }
  };
  // Get user details with user id
  const getUserById = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'user/' + id, options);
  };

  return {
    getUserByToken,
    postUser,
    checkUsername,
    putUser,
    getUserById,
    awardXp,
  };
};
export {useAuthentication, useUser};
