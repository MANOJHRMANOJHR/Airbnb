export const setItemsInLocalStorage = (key, value) => {
  if (!key || !value) {
    return console.error('Cannot store in LS');
  }
/* LINE 1*/
  const valueToStore =
    typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error(`Cannot get value from LS`);
    //It prints the message in red in the console.
    //The function returns undefined.
  }
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error(`Cannot remove item from LS`);
  }
  localStorage.removeItem(key);
};
