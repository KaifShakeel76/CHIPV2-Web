// src/components/auth/LogoutButton.tsx
import { useAppDispatch } from '@/hooks/reduxHooks';
import { logout } from '@/features/auth/authSlice';

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <button onClick={handleLogout} className="text-red-600">
      Logout
    </button>
  );
}
