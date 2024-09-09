import {apiUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';

// hooks for managin inventory
const useInventory = () => {
  // get users items in inventory
  const getUserInventory = async (token) => {
    console.log('Token:', token);
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(apiUrl + 'inventory/getInventory', options);
    } catch (error) {
      throw new Error('Get user inventory error', error.message);
    }
  };

  const addItemsToInventory = async (items, token) => {
    const body = {
      goldCoins: items.goldCoins || 0, // Default to 0 if not provided
      tournamentTickets: items.tournamentTickets || 0, // Default to 0 if not provided
      otherItems: items.otherItems || {}, // Default to an empty object if not provided
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    try {
      return await doFetch(apiUrl + 'inventory/add', options);
    } catch (error) {
      throw new Error('Add items to inventory error: ' + error.message);
    }
  };
  // deduct items from inventory
  const deductItemsFromInventory = async (items, token) => {
    const body = {
      goldCoins: items.goldCoins || 0,
      tournamentTickets: items.tournamentTickets || 0,
      otherItems: items.otherItems || {},
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    try {
      return await doFetch(apiUrl + 'inventory/deduct', options);
    } catch (error) {
      throw new Error('Deduct items from inventory error', error.message);
    }
  };
  return {getUserInventory, addItemsToInventory, deductItemsFromInventory};
};
export {useInventory};
