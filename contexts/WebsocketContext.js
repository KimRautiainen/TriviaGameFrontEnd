import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverUrl} from '../utils/app-config';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({children}) => {
  const [ws, setWs] = useState(null);
  const [events, setEvents] = useState({}); // A state to store event handlers

  const addEventListener = useCallback((type, handler) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [type]: [...(prevEvents[type] || []), handler],
    }));
  }, []);

  const removeEventListener = useCallback((type, handler) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [type]: (prevEvents[type] || []).filter((h) => h !== handler),
    }));
  }, []);

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }

      const websocket = new WebSocket(serverUrl, token);

      websocket.onopen = () => console.log('WebSocket connection established.');

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        const {type, payload} = message;

        // Trigger all event handlers for the message type
        if (events[type]) {
          events[type].forEach((handler) => handler(payload));
        }
      };

      websocket.onerror = (error) =>
        console.error('WebSocket error:', error.message);
      websocket.onclose = () => console.log('WebSocket connection closed.');

      setWs(websocket);
    };

    initializeWebSocket();

    return () => {
      if (ws) {
        ws.close();
        console.log('WebSocket connection cleaned up.');
      }
    };
  }, [events]);

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        addEventListener,
        removeEventListener,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
