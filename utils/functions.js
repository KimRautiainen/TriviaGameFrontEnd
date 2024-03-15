const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
    return json;
  } catch (error) {
    throw new Error('doFetch failed: ' + error.message);
  }
};

export {doFetch};
