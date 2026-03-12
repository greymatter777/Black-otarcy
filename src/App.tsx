import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import AioReport from "./pages/AioReport";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Glossaire from "./pages/Glossaire";
import Faq from "./pages/Faq";
import AioCoaching from "./pages/AioCoaching";
import AioEcommerce from "./pages/AioEcommerce";
import AioImmobilier from "./pages/AioImmobilier";
import AioRestauration from "./pages/AioRestauration";
import AioRh from "./pages/AioRh";
import AioSante from "./pages/AioSante";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Chargement...</div>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/glossaire" element={<Glossaire />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/aio-coaching" element={<AioCoaching />} />
          <Route path="/aio-ecommerce" element={<AioEcommerce />} />
          <Route path="/aio-immobilier" element={<AioImmobilier />} />
          <Route path="/aio-restauration" element={<AioRestauration />} />
          <Route path="/aio-rh" element={<AioRh />} />
          <Route path="/aio-sante" element={<AioSante />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/aio-report" element={<PrivateRoute><AioReport /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
