import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverUrl} from '../utils/app-config';

// Create a WebSocket context for sharing WebSocket-related data and methods
export const WebSocketContext = createContext();

export const WebSocketProvider = ({children}) => {
  const [ws, setWs] = useState(null); // State to hold the WebSocket instance
  const [events, setEvents] = useState({}); // State to store a mapping of event types to their associated handlers

  /**
   * Add an event listener for a specific message type.
   * This will store the handler in the events state under the provided type.
   * @param {string} type - The type of WebSocket message.
   * @param {function} handler - The function to handle messages of this type.
   */
  const addEventListener = useCallback((type, handler) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [type]: [...(prevEvents[type] || []), handler],
    }));
  }, []);

  /**
   * Remove a specific event listener for a specific message type.
   * This will remove the handler from the events state.
   * @param {string} type - The type of WebSocket message.
   * @param {function} handler - The function to remove.
   */
  const removeEventListener = useCallback((type, handler) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [type]: (prevEvents[type] || []).filter((h) => h !== handler),
    }));
  }, []);

  /**
   * useEffect hook to initialize the WebSocket connection and handle its lifecycle.
   * The WebSocket is connected using a user token stored in AsyncStorage.
   */
  useEffect(() => {
    const initializeWebSocket = async () => {
      // Retrieve the user token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('User token not found.');
        return;
      }

      // Create a new WebSocket connection using the token
      const websocket = new WebSocket(serverUrl, token);

      // Log when the connection is successfully opened
      websocket.onopen = () => console.log('WebSocket connection established.');

      // Handle incoming messages
      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data); // Parse the incoming message
        console.log('WebSocket message received:', message);

        const {type, payload} = message;

        // Trigger all registered handlers for the received message type
        if (events[type]) {
          events[type].forEach((handler) => handler(payload));
        }
      };

      // Handle WebSocket errors
      websocket.onerror = (error) =>
        console.error('WebSocket error:', error.message);
      websocket.onclose = () => console.log('WebSocket connection closed.');

      // Save the WebSocket instance to state
      setWs(websocket);
    };

    initializeWebSocket();

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      if (ws) {
        ws.close();
        console.log('WebSocket connection cleaned up.');
      }
    };
  }, [events]);

  // Provide the WebSocket instance and utility methods to child components
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
