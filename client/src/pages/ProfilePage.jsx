import { useState } from "react";
import { toFormData } from "axios";
import { Camera, Mail, User } from "lucide-react";

import { useApiQuery } from "../hooks/useApiQuery";

const ProfilePage = ({ mutation: UpdateProfileMutation }) => {

  const { data: authUser } = useApiQuery({
    keys: ["auth"],
    path: "/auth/check",
    errorMessage: "Failed to fetch authentication status",
    
  });

  const [selectedImg, setSelectedImg] = useState(null); 

  const handleImageUpload = async e => {
    setSelectedImg(URL.createObjectURL(e.target.files[0]));
    UpdateProfileMutation.mutate(toFormData({ profilePic: e.target.files[0] }));
  }

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
                <label className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${UpdateProfileMutation.isPending ? "animate-pulse pointer-events-none" : ""}`} htmlFor="avatar-upload">
                  <Camera className="w-5 h-5 text-base-200" />
                  <input className="hidden"
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={UpdateProfileMutation.isPending}
                  />
                </label>
              </div>
              <p className="text-sm">
                {UpdateProfileMutation.isPending ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.username}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-base-content/20">
                  <span>Member Since</span>
                  <span>{authUser?.createdAt?.split("T")[0] || "2024-02-06"}</span>
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