import { useProfile } from '../context/ProfileContext';

const ProfileSettings = () => {
  const { profileName, setProfileName } = useProfile();

  return (
    <div className="p-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">Your Name</label>
      <input
        type="text"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
    </div>
  );
};

export default ProfileSettings;
