import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '@/components/ui/AccountNav';

import EditProfileDialog from '@/components/ui/EditProfileDialog';
import { LogOut, Mail, Text } from 'lucide-react'; // react wrapper for the lucide icon set, customizable open source SVG icons
import { useAuth } from '../../hooks';
import PlacesPage from './PlacesPage';

const ProfilePage = () => {
  const auth = useAuth();
  const { user, logout } = auth;
  const [redirect, setRedirect] = useState(null);
  const [imgError, setImgError] = useState(false);

  let { subpage } = useParams();
  if (!subpage) {
    subpage = 'profile';
  }

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success(response.message);
      setRedirect('/');
    } else {
      toast.error(response.message);
    }
  };

  if (!user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="m-4 flex flex-col items-center gap-8 rounded-[10px]  p-4 sm:h-1/5 sm:flex-row sm:items-stretch lg:gap-28 lg:pl-32 lg:pr-20">
          {/* avatar */}
          <div className="flex h-40 w-40 justify-center rounded-full bg-gray-200 p-4  sm:h-72 sm:w-72 md:h-96 md:w-96">
            <div className='relative flex h-full w-full shrink-0 overflow-hidden rounded-full'>
              {!imgError && user.picture ? (
                <img src={user.picture}  onError={() => setImgError(true)} className='aspect-square h-full w-full' />
              ) : (
                <img src="https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png"  onError={() => setImgError(true)} className="object-cover aspect-square h-full w-full"/>
              )}
              {imgError ?(
                <div className='flex h-full w-full text-9xl items-center justify-center rounded-full bg-muted'>{user.name.slice([0], [1])} </div>
              ):(<></> )}
            {  /*<AvatarFallback>{user.name.slice([0], [1])}</AvatarFallback>*/}
            </div>
          </div>

          <div className="flex grow flex-col items-center gap-10 sm:items-start sm:justify-around sm:gap-0">
            {/* user details */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="flex items-center gap-2">
                <Text height="18" width="18" />
                <div className="text-xl">
                  <span>Name: </span>
                  <span className="text-gray-600">{user.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail height="18" width="18" />
                <div className="text-xl">
                  <span>Email: </span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
              </div>
              <p></p>
            </div>

            {/* Action buttons */}
            <div className="flex w-full justify-around sm:justify-end sm:gap-5 md:gap-10">
              {/* <Button varient="secondary">Edit profile</Button> */}
              <EditProfileDialog />

              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2
" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
       {subpage === 'bookings' && <BookingsPage />}
      {subpage === 'places' && <PlacesPage />}
     
    </div>
  );
};

export default ProfilePage;
