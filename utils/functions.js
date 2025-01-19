// -- Helper function for all hooks -- //
const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const text = await response.text(); // Get the raw response text
    try {
      const json = JSON.parse(text); // Attempt to parse JSON
      if (!response.ok) {
        const message = json.error
          ? `${json.message}: ${json.error}`
          : json.message;
        throw new Error(message || response.statusText);
      }
      return json;
    } catch (jsonError) {
      // Log the raw response if JSON parsing fails
      console.error('Failed to parse JSON:', text);
      throw new Error('doFetch failed: ' + jsonError.message);
    }
  } catch (error) {
    throw new Error('doFetch failed: ' + error.message);
  }
};

export {doFetch};
