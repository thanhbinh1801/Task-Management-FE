import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import NotFound from "./pages/auth/NotFound";
import OAuthCallback from "./pages/auth/OauthCallback";
import WorkspaceItem from "./components/workspaces/WorkspaceItem";
import BoardItem from "./components/board/BoardItem";
import BoardLayout from "./layout/BoardLayout";
import AppLayout from "./layout/AppLayout";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
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
