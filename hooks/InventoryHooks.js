import {apiUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';

// hooks for managin inventory
const useInventory = () => {
  // get users items in inventory
  const getUserInventory = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await doFetch(apiUrl + 'inventory/getInvetory', options);
    } catch (error) {
      throw new Error('Get user inventory error', error.message);
    }
  };

  // add items to inventory
  const addItemsToInventory = async (items, token) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(items),
    };
    try {
      return await doFetch(apiUrl + 'inventory/add', options);
    } catch (error) {
      throw new Error('Add items to inventory error', error.message);
    }
  };

  // deduct items from inventory
  const deductItemsFromInventory = async (items, token) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(items),
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
