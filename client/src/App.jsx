import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './components/ui/Spinner';

import { useAuth } from '../hooks';
import Layout from './components/ui/Layout';
import BookingsPage from './pages/BookingsPage';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PlacePage from './pages/PlacePage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacesPage from './pages/PlacesPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SingleBookedPlace from './pages/SingleBookedPlace';

import { getItemFromLocalStorage, setItemsInLocalStorage } from './utils';
import axiosInstance from './utils/axios';


import { PlaceProvider } from './providers/PlaceProvider';
import { UserProvider } from './providers/UserProvider';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

function AppRoutes() {

    const location = useLocation();
    const auth = useAuth();
    const {loading, setLoading , setUser} = auth;

    const [isok, setok] = useState(false);
/*
  useEffect(() => {
    / set the token on refreshing the website
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${getItemFromLocalStorage('token')}`; //it can be undefined or null
  }, []);
  */
/*  here defaults is for  all http requests and common is for all methods (irrespective of get , put, post, delete etc) */
/* HERE axiosInstance is the response got from an axios get request to a server along with the object containing withCredentials: true */
/*
    useEffect(() => {
           const call = async () => {
                 const { data } = await axiosInstance.get('/user/auth');
/*
await axiosInstance.get('/user/auth')

If the request succeeds → code continues to the if/else.

If the request fails (e.g. 401 Unauthorized, network error, invalid token) → JavaScript throws an exception here, and execution jumps out of the function.

/
               if(data.user){      // <-- only reached if request succeeds 
               console.log(data.user);   
               setUser(data.user)
               / in the localstorage the data will always be stored in the form of string though you not convert it
               / while retriving it you need to do JSON.Parse()  
               / this is different from sending data of io instances  to the server  
              
               / save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
                setok(true);
                }
                else{
                    setok(false);
                }
                setLoading(false);    // <-- only reached if request succeeds

           };
         call();
    }, [location.pathname]);
    */
// when this useeffect runs , the state changes and component rerenders because of ok , and the userprovider calls the function again and sets user  to null
// to avoid this keep the userprovider in another component, so if it rerenderes it does not happen anything

/*

❌ Problems

If /user/auth request throws an error (e.g., no token, bad token, network issue), your call() never reaches setLoading(false) → loading stays true → spinner never stops.

You’re also setting axiosInstance.defaults.headers.common['Authorization'] in the first useEffect, but if getItemFromLocalStorage('token') returns null or undefined, you’re literally sending:

Authorization: Bearer null

which breaks the backend and results in a 401 + error → your loader never finishes.
*/

useEffect(() => {
  const call = async () => {
    try {
      const { data } = await axiosInstance.get('/user/auth');
      if (data.user) {
        setUser(data.user);
        setItemsInLocalStorage('user', data.user);
        setItemsInLocalStorage('token', data.token);
        setok(true);
      } else {
        setok(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setok(false);
    } finally {
      setLoading(false); // always runs
    }
  };
  call();
}, [location.pathname]);


if(loading){
  return <Spinner/>;
}

return (
  <>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account"  element={isok ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/account/places" element={isok ?<PlacesPage /> : <Navigate to="/login" />}/>
              <Route path="/account/places/new" element={isok ? <PlacesFormPage />: <Navigate to="/login" />} />
              <Route path="/account/places/:id"  element={isok ? <PlacesFormPage /> : <Navigate to="/login" />} />
              <Route path="/place/:id" element={isok ?<PlacePage />: <Navigate to="/login" />}/>
              <Route path="/account/bookings" element={isok ? <BookingsPage /> : <Navigate to="/login" />} />
              <Route
                path="/account/bookings/:id"
                element={isok ? <SingleBookedPlace /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <ToastContainer autoClose={2000} transition={Slide} />
       </>
  );
}

const App = () => {
  return (
  <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
           <UserProvider>
             <PlaceProvider>
         <BrowserRouter>
        <AppRoutes /> 
      </BrowserRouter>
     </PlaceProvider>
      </UserProvider>
    </GoogleOAuthProvider>
    </>
  );
};


export default App;
