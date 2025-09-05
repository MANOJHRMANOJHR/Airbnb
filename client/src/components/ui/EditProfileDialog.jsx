import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { X } from "lucide-react";


import { Loader2, PenSquare, Upload } from 'lucide-react';
import { useAuth } from '../../../hooks';

const EditProfileDialog = () => {
  const { user, setUser, uploadPicture, updateUser } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const uploadRef = useRef(null);
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    password: '',
    confirm_password: '',
  });

  const handleImageClick = () => {
    uploadRef.current.click();
    /*This is called when the user clicks on the div (not the input).
It triggers a programmatic click on the hidden <input type="file" />.
So, the native file browser opens up.similar to a <input type="text" /> for entering the text
*/

  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    //data type is File, which is a built-in JavaScript class representing a file from the user's system.
    /*
    Called when the user selects a file in the file browser.

e.target.files[0] gets the first selected file (image, presumably).
    */
  };

  const handleUserData = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, password, confirm_password } = userData;

    // Validation
    if (name.trim() === '') {
      setLoading(false);
      return toast.error("Name Can't be empty");
    } else if (password !== confirm_password) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }

    try {
      // first check if picture has been updated or not
      let pictureUrl = '';
      if (picture) {
        //In JavaScript, an empty string ("") is a falsy value.
        //Both null and undefined are falsy values in JavaScript.
        // upload picture and save the image url
        pictureUrl = await uploadPicture(picture);
      }

      const userDetails = {
        name: userData.name,
        password: userData.password,
        picture: pictureUrl,
      };

      const res = await updateUser(userDetails);
      if (res.success) {
        setUser(res.user);
        setLoading(false);
        return toast.success('Updated successfully!');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <>
    {showDialog && (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
    <div className="relative z-50 w-full max-w-lg bg-background border p-6 shadow-lg sm:rounded-lg">
      {/* Close Button */}
      <button
        onClick={() => setShowDialog(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>

      {/* Avatar Upload Section */}
      <div className="flex justify-center">
        <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10"
            onClick={handleImageClick}
          >
            <input
              type="file"
              className="hidden"
              ref={uploadRef}
              onChange={handlePictureChange}
            />
            <Upload height={50} width={50} color="#4e4646" />
          </div>

          {/* Avatar Image */}
          {picture ? (
            <div className="relative flex h-full w-full overflow-hidden rounded-full transition-all ease-in-out hover:z-0 hover:hidden">
              <img
              //To display the uploaded image that the user selected — by setting the image's src to a temporary URL representing the uploaded file.
              // It does NOT upload the file to any server — it only creates a local preview.  
              src={URL.createObjectURL(picture)}
                className="aspect-square h-full w-full"
              />
            </div>
          ) : (
            <div className="relative flex h-full w-full overflow-hidden rounded-full transition-all ease-in-out hover:z-0 hover:hidden">
              <img
                src={user.picture}
                className="aspect-square h-full w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Update Form */}
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleUserData}
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right"
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleUserData}
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="confirm_password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right"
          >
            Confirm Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={userData.confirm_password}
            onChange={handleUserData}
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <button
          disabled={loading}
          type="submit"
          onClick={handleSaveChanges}
          className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </button>
      </div>
    </div>
  </div>
)}

{/* Trigger Button (outside of dialog) */}
<button
  onClick={() => setShowDialog(true)}
  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-600 text-primary-foreground h-10 px-4 py-2"
>
  <PenSquare className="mr-2 h-4 w-4" />
  Edit Profile
</button>

    </>
  );
};

export default EditProfileDialog;
