import {useContext, useEffect, useState} from 'react';
import {triviaUrl, apiUrl, authUrl, mediaUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';
import {MainContext} from '../contexts/MainContext';

const useAuthentication = () => {
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
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'user/token', options);
  };

  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    return await doFetch(authUrl + 'register', options);
  };

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
  const getUserById = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'users/' + id, options);
  };

  return {
    getUserByToken,
    postUser,
    checkUsername,
    putUser,
    getUserById,
  };
};
export {useAuthentication, useUser};
