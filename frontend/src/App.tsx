import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider } from './context/UIContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BestieChat } from './bestie/BestieChat';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { WardrobePage } from './pages/WardrobePage';
import { WardrobeUploadPage } from './pages/WardrobeUploadPage';
import { OutfitGeneratorPage } from './pages/OutfitGeneratorPage';
import { MyLooksPage } from './pages/MyLooksPage';
import { ChatPage } from './pages/ChatPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { TravelAssistantPage } from './pages/TravelAssistantPage';
import { VirtualTryOnPage } from './pages/VirtualTryOnPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { CloudMonitorPage } from './pages/CloudMonitorPage';
import { AIFitStudioPage } from './pages/AIFitStudioPage';
import { ShouldIWearThisPage } from './pages/ShouldIWearThisPage';
import { OutfitComparisonPage } from './pages/OutfitComparisonPage';
import { AgentInsightsPage } from './pages/AgentInsightsPage';
import { TryOnPage } from './pages/TryOnPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <UIProvider>
              <div className="min-h-screen flex flex-col bg-[#09090b] text-white relative selection:bg-violet-500/30 selection:text-white">
                {/* Ambient dynamic glow meshes */}
                <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.12),rgba(255,255,255,0))] -z-10" />
                <div className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(99,102,241,0.08),rgba(255,255,255,0))] -z-10" />
                
                <Navbar />
                <main className="flex-1 pt-24 pb-12">
                  <Routes>
                    {/* MAANG Explicit Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/try-on" element={<TryOnPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/wardrobe" element={<WardrobePage />} />

                    {/* Extended StyleSense AI Suite */}
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/wardrobe/upload" element={<WardrobeUploadPage />} />
                    <Route path="/outfit-generator" element={<OutfitGeneratorPage />} />
                    <Route path="/my-looks" element={<MyLooksPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/travel-assistant" element={<TravelAssistantPage />} />
                    <Route path="/virtual-tryon" element={<TryOnPage />} />
                    <Route path="/ai-fit-studio" element={<AIFitStudioPage />} />
                    <Route path="/should-i-wear-this" element={<ShouldIWearThisPage />} />
                    <Route path="/compare-looks" element={<OutfitComparisonPage />} />
                    <Route path="/agent-insights" element={<AgentInsightsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/admin/cloud-monitor" element={<CloudMonitorPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
                {/* Global Live AI Fashion Bestie Chat Drawer */}
                <BestieChat />
              </div>
            </UIProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
