import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore";

const ProtectRouter = () => {
  const { username } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // 🚀 sessionStorage 값이 반영될 때까지 로딩 상태 유지
  }, []);

  if (loading) return <div>로딩 중...</div>; // ✅ 추가: sessionStorage 반영될 때까지 로딩 화면 표시

  return username ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectRouter;
