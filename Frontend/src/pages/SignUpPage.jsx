import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate=useNavigate()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    console.log({ username, fullname, password, profilePhoto });
    if(profilePhoto){
        const data=new FormData()
        data.append("file",profilePhoto)
        data.append("upload_preset","Chat_App")
        data.append("cloud_name","dmxwohjpp")
        const res=await axios.post("https://api.cloudinary.com/v1_1/dmxwohjpp/image/upload",
          data
        )
        const {url}=res.data
        try{
      const response=await axios.post("http://localhost:5000/api/user/register",{
        username,
        fullname,
        password,
        profilephoto:url
      },{withCredentials:true})
      const id=response.data.user._id
      localStorage.setItem("userId",id)
      navigate("/home")

    }catch(err){
      console.log(err)
      const message=err.response?.data?.message||"Something went wrong"
      alert(message)
    }
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          {/* Fullname */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-600"
            >
              Fullname
            </label>
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          {/* Profile Photo */}
          <div>
            <label
              htmlFor="profilePhoto"
              className="block text-sm font-medium text-gray-600"
            >
              Profile Photo
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-1 block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Profile Preview"
                className="mt-4 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
