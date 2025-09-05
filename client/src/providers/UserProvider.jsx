import { createContext } from 'react';

import { useProvideAuth } from '../../hooks';

const initialState = {
  user: null,
  setUser: () =>{},
  register: () => {},
  login: () => {},
  googleLogin: () => {},
  logout: () => {},
  loading: true,
  setLoading: ()=>{},
  uploadPicture: ()=>{},
  updateUser: ()=>{}
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const auth = useProvideAuth();

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
