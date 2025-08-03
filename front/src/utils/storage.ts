// Clear specific keys from localStorage
function clearLocalStorageItems(keys: string[]) {
  for (let i = 0; i < keys.length; i++) {
    localStorage.removeItem(keys[i]);
  }
}

// Clear all localStorage
function clearAllLocalStorage() {
  localStorage.clear();
}

export { clearLocalStorageItems, clearAllLocalStorage };
