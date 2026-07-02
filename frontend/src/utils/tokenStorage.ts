import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'dishaspora_jwt_token';
const USER_KEY = 'dishaspora_user';

// Save token after login
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

// Get token (to attach to API requests)
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Delete token on logout
export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// Save user info
export const saveUser = async (user: object) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

// Get user info
export const getUser = async () => {
  const user = await SecureStore.getItemAsync(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Delete user info on logout
export const deleteUser = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

// Full logout — clears everything
export const logout = async () => {
  await deleteToken();
  await deleteUser();
};