// src/components/Header.tsx
export function Header() {
    return (
      <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <img
          src="/placeholder.svg"
          alt="Left Logo"
          width={80}
          height={80}
          className="h-16 w-auto"
          loading="lazy"
        />
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#183966]">CHIP</h1>
          <p className="text-[#183966]">
            Community Health Integrated Platform - CHIP
          </p>
        </div>
  
        <img
          src="/placeholder.svg"
          alt="Right Logo"
          width={80}
          height={80}
          className="h-16 w-auto"
          loading="lazy"
        />
      </header>
    );
  }
  