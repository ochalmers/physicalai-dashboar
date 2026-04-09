import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { AssetsHubPage } from "@/pages/AssetsHubPage";
import { PropsPage } from "@/pages/PropsPage";
import { MaterialsPage } from "@/pages/MaterialsPage";
import { EnvironmentLibraryPage } from "@/pages/EnvironmentLibraryPage";
import { KitchenConfiguratorPage } from "@/pages/KitchenConfiguratorPage";
import { EnvironmentWorkspacePage } from "@/pages/EnvironmentWorkspacePage";
import { ApiDocsPage } from "@/pages/ApiDocsPage";
import { SimReadyPage } from "@/pages/SimReadyPage";
import { AccountPage } from "@/pages/AccountPage";
import { RequestCustomPage } from "@/pages/RequestCustomPage";
import { SignInPage } from "@/pages/SignInPage";
import { TalkToTeamFramesPage } from "@/pages/TalkToTeamFramesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetsHubPage />} />
          <Route path="/assets/props" element={<PropsPage />} />
          <Route path="/assets/materials" element={<MaterialsPage />} />
          <Route path="/environments" element={<EnvironmentLibraryPage />} />
          <Route path="/environments/kitchen/batch" element={<Navigate to="/environments/kitchen/configure" replace />} />
          <Route path="/environments/kitchen/scene" element={<KitchenConfiguratorPage />} />
          <Route path="/environments/:environmentSlug/:section" element={<EnvironmentWorkspacePage />} />
          <Route path="/environments/request-custom" element={<RequestCustomPage />} />
          <Route path="/batch" element={<Navigate to="/environments/kitchen/configure" replace />} />
          <Route path="/api" element={<ApiDocsPage />} />
          <Route path="/simready" element={<SimReadyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/dev/talk-to-team-frames" element={<TalkToTeamFramesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
