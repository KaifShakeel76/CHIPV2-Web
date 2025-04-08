import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import LoginWrapper from "@/components/auth/LoginWrapper";
import { MapSection } from "@/components/map-section";



export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6fb]">
      <Header />

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8">
        <MapSection />
        <LoginWrapper/>
      </main>

      <Footer />
    </div>
  )
}

