import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import NotFound from "./pages/auth/NotFound";
import OAuthCallback from "./pages/auth/OauthCallback";
import DashboardLayout from "./pages/layout/DashboardLayout";
import WorkspaceItem from "./components/workspaces/WorkspaceItem";
import BoardItem from "./components/board/BoardItem";
import BoardLayout from "./pages/layout/BoardLayout";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workspace/:workspaceId" element={<WorkspaceItem />} />
      </Route>

      <Route
        path="workspace/:workspaceId/board/:boardId"
        element={
          <ProtectedRoute>
            <BoardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BoardItem />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
