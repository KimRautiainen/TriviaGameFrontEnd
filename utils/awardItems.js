import {useInventory} from '../hooks/InventoryHooks';

// award tournament tickets, gold coins, or other items to the user
export const awardItemsToUser = async (token, items) => {
  const {addItemsToInventory} = useInventory();

  try {
    const response = await addItemsToInventory(items, token);

    if (response.ok) {
      console.log(`Successfully awarded items to user`);
      return response;
    } else {
      console.error(`Failed to award items to user:`, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error while awarding items:', error);
    return null;
  }
};
