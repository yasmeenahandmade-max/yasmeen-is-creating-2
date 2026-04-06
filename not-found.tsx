import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Decorative 404 */}
          <div className="relative mb-8">
            <p className="text-[120px] sm:text-[160px] font-serif tracking-wider text-[#EDDBD5] leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#C4918A]/40" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-medium text-[#4A4A4A] mb-3 tracking-wide">
            Page Not Found
          </h1>
          <p className="text-sm text-[#4A4A4A]/50 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#4A4A4A] text-white text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-[#5B6E5D] transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/en/store"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-[#4A4A4A] text-sm font-medium tracking-widest uppercase border border-[#4A4A4A] rounded-sm hover:bg-[#4A4A4A] hover:text-white transition-all"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
