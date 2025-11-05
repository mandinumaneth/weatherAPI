import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout, user } = useAuth0();

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/90 text-xs sm:text-sm italic">
        {user?.email}
      </span>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg shadow transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
}
