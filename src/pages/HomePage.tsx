import { Footer } from "@/components/homepage/footer"
import { HeaderWithApi } from "@/components/homepage/header-with-api"
import LoginContainer from "@/components/auth/login/LoginContainer"
import { MapSection } from "@/components/homepage/map-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <HeaderWithApi />

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-8 gap-6 py-6">
        <div className="w-full md:w-1/2 flex justify-center">
          <MapSection />
        </div>

        <div className="w-full md:w-[55%] lg:w-[45%] xl:w-[35%] flex justify-center">
          <LoginContainer />
        </div>
      </main>

      <Footer />
    </div>
  )
}
