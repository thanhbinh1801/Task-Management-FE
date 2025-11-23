import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Workspaces from "./pages/dashboard/Workspace";
import WorkspaceDetail from "./pages/dashboard/WorkspaceDetail";
import NotFound from "./pages/auth/NotFound";
import WorkspaceLayout from "./pages/layout/WorkpaceLayout";
import Board from "./pages/board/board";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/workspace" element={<WorkspaceLayout />}>
        <Route path="" element={<Workspaces />} />
        <Route path=":id" element={<WorkspaceDetail />} />
      </Route>
      <Route
        path="/workspace/:workspaceId/board/:boardId"
        element={<Board />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
