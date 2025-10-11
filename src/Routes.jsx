import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import ResultsDashboard from './pages/results-dashboard';
import AnalysisLoadingScreen from './pages/analysis-loading-screen';
import CSVUploadInterface from './pages/csv-upload-interface';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/results-dashboard" element={<ResultsDashboard />} />
        <Route path="/analysis-loading-screen" element={<AnalysisLoadingScreen />} />
        <Route path="/csv-upload-interface" element={<CSVUploadInterface />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
