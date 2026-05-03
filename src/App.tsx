import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "~/pages/index";
import ContactPage from "~/pages/contacts/[id]";
import CompanyPage from "~/pages/companies/[id]";
import ResponsePage from "~/pages/response/index";
import ResponseDetailPage from "~/pages/response/[id]";
import TeamPage from "~/pages/team/index";
import TeamDetailPage from "~/pages/team/[id]";
import PricingPage from "~/pages/pricing/index";
import AccountsPage from "~/pages/accounts/index";
import AccountDetailPage from "~/pages/accounts/[id]";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contacts/:id" element={<ContactPage />} />
        <Route path="/companies/:id" element={<CompanyPage />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/response/:id" element={<ResponseDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:id" element={<TeamDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
