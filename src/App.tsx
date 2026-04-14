import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Ingest from "@/pages/ingest";
import ICP from "@/pages/icp";
import Leads from "@/pages/leads";
import Campaigns from "@/pages/campaigns";
import CampaignDetail from "@/pages/campaign-detail";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="ingest" element={<Ingest />} />
        <Route path="icp/:id" element={<ICP />} />
        <Route path="leads" element={<Leads />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/:id" element={<CampaignDetail />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
