import { Router, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingFallback from '@/components/ui/LoadingFallback';
import CompareBar from '@/components/compare/CompareBar';
import '@/i18n/config';

// Lazy load all page components
const Home = lazy(() => import('@/pages/Home'));
const Properties = lazy(() => import('@/pages/Properties'));
const PropertyDetails = lazy(() => import('@/pages/PropertyDetails'));
const Agents = lazy(() => import('@/pages/Agents'));
const AgentDetails = lazy(() => import('@/pages/AgentDetails'));
const Developers = lazy(() => import('@/pages/Developers'));
const DeveloperDetails = lazy(() => import('@/pages/DeveloperDetails'));
const Archive = lazy(() => import('@/pages/Archive'));
const Careers = lazy(() => import('@/pages/Careers'));
const CareerDetails = lazy(() => import('@/pages/CareerDetails'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Profile = lazy(() => import('@/pages/Profile'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Compare = lazy(() => import('@/pages/Compare'));
const VerifySearch = lazy(() => import('@/pages/VerifySearch'));
const VerifyAgent = lazy(() => import('@/pages/VerifyAgent'));
const MortgageCalculator = lazy(() => import('@/pages/MortgageCalculator'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
const Disclaimer = lazy(() => import('@/pages/legal/Disclaimer'));
const CookiePolicy = lazy(() => import('@/pages/legal/CookiePolicy'));
const AddressesManagement = lazy(() => import('@/pages/admin/AddressesManagement'));
const FeaturesManagement = lazy(() => import('@/pages/admin/Features'));
const AgentsManagement = lazy(() => import('@/pages/admin/AgentsManagement'));
const SocialMediaManagement = lazy(() => import('@/pages/admin/SocialMediaManagement'));

function App() {
  const { i18n } = useTranslation();

  // Set direction on app load and language change
  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Route path="/" component={Home} />
              <Route path="/properties" component={Properties} />
              <Route path="/properties/:id" component={PropertyDetails} />
              <Route path="/agents" component={Agents} />
              <Route path="/agents/:id" component={AgentDetails} />
              <Route path="/developers" component={Developers} />
              <Route path="/developers/:id" component={DeveloperDetails} />
              <Route path="/archive" component={Archive} />
              <Route path="/careers" component={Careers} />
              <Route path="/careers/:id" component={CareerDetails} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/profile">
                <ProtectedRoute><Profile /></ProtectedRoute>
              </Route>
              <Route path="/favorites" component={Favorites} />
              <Route path="/notifications">
                <ProtectedRoute><Notifications /></ProtectedRoute>
              </Route>
              <Route path="/settings">
                <ProtectedRoute><Settings /></ProtectedRoute>
              </Route>
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/compare" component={Compare} />
              <Route path="/verify-search/:token" component={VerifySearch} />
              <Route path="/verify-agent" component={VerifyAgent} />
              <Route path="/mortgage-calculator" component={MortgageCalculator} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/disclaimer" component={Disclaimer} />
              <Route path="/cookie-policy" component={CookiePolicy} />
              <Route path="/admin/addresses">
                <ProtectedRoute><AddressesManagement /></ProtectedRoute>
              </Route>
              <Route path="/admin/features">
                <ProtectedRoute><FeaturesManagement /></ProtectedRoute>
              </Route>
              <Route path="/admin/agents">
                <ProtectedRoute><AgentsManagement /></ProtectedRoute>
              </Route>
              <Route path="/admin/settings">
                <ProtectedRoute><SocialMediaManagement /></ProtectedRoute>
              </Route>
            </Suspense>
          </main>
          <CompareBar />
          <Footer />
        </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;