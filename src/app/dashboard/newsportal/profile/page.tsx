import React from "react";
import { FaImage } from "react-icons/fa";

const Profile = () => {
  return (
    <div className="mt-5 grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="flex items-center rounded-lg bg-white p-6 shadow-md">
        <div className="flex-shrink-0">
          <label
            htmlFor="img"
            className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-200 text-gray-600 transition duration-300 hover:bg-gray-200"
          >
            <FaImage className="text-4xl" />
            <span className="mt-2">Select Image</span>
          </label>
          <input type="file" id="img" className="hidden" />
        </div>

        <div className="ml-6 flex flex-col space-y-2 text-gray-700">
          <h3 className="text-xl font-bold">Kazi Ariyan</h3>
          <p className="text-sm">
            Email: <span className="text-gray-600">ariyan@gmail.com</span>
          </p>
          <p className="text-sm">
            Category: <span className="text-gray-600">Education</span>
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 text-gray-700 shadow-md">
        <h2 className="mb-5 text-center text-lg font-bold">Change Password</h2>
        <form>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="old_password"
                className="text-md block font-semibold text-gray-600"
              >
                Old Password{" "}
              </label>
              <input
                type="password"
                id="old_password"
                name="old_password"
                placeholder="Enter Old Passowrd"
                className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2 outline-none transition duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="text-md block font-semibold text-gray-600"
              >
                New Password{" "}
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                placeholder="Enter New Passowrd"
                className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2 outline-none transition duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-800"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
