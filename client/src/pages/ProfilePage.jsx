import { Camera, Mail, User } from "lucide-react";
import { useState, useMemo, useCallback } from "react";

import { toFormData } from "axios";
import { useApiQuery } from "../hooks/useApiQuery";
import { useApiMutation } from "../hooks/useApiMutation";

const ProfilePage = () => {

  const { data: authUser } = useApiQuery({ keys: ["authUser"], path: '/auth/check' });

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } = useApiMutation({
    keys: ["authUser"],
    method: "patch",
    path: "/auth/profile-update",
    message: "Profile updated!",
  })

  const [selectedImg, setSelectedImg] = useState(null);

  const MemoizedCamera = useMemo(() => (
    <Camera className="w-5 h-5 text-base-200" />
  ), []);

  const MemoizedUser = useMemo(() => (
    <User className="w-4 h-4" />
  ), []);

  const MemoizedMail = useMemo(() => (
    <Mail className="w-4 h-4" />
  ), []); 

  const handleImageUpload = useCallback(async (e) => {
    setSelectedImg(URL.createObjectURL(e.target.files[0]));
    updateProfileMutation(toFormData({ profilePic: e.target.files[0] }));
  }, [setSelectedImg, updateProfileMutation])


  return (
    <div className="overflow-auto">

      <section className="h-[100svh] pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-200 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img className="size-32 rounded-full object-cover border-4 "
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                />
                <label className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`} htmlFor="avatar-upload">
                  {MemoizedCamera}
                  <input className="hidden"
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm flex items-center gap-2">
                  {MemoizedUser}
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.username}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm flex items-center gap-2">
                  {MemoizedMail}
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-base-content/20">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProfilePage;