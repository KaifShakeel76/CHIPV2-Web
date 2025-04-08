// src/components/Footer.tsx
export function Footer() {
    return (
      <footer className="py-4 px-6 text-center text-[#606060] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm border-t border-gray-200">
        <a href="#" className="hover:underline">
          Terms & Conditions
        </a>
  
        <div className="border-l border-[#d9d9d9] pl-4 sm:pl-8">
          Helpline <span className="font-medium">+98737 63728</span>
        </div>
      </footer>
    );
  }
  