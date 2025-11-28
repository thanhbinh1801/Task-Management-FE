import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL fragment (sau dấu #)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Bỏ dấu #
    const accessToken = params.get("token");
    
    if (accessToken) {
      localStorage.setItem("access-token", accessToken);
      // Xóa token khỏi URL
      window.history.replaceState(null, "", window.location.pathname);
      toast.success("Login with Google successful!");
      navigate("/dashboard");
    } else {
      toast.error("Login failed - No token received");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
}

export default OAuthCallback;