import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { defaultMetadata } from "@/lib/seo/config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="zgiWyXeHgPHmCv9VJuttjcKiftoMpO7JTwz1o4Isdvs"
        />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MLMZNR95');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZJS72BQ6RY"
        />
        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZJS72BQ6RY');`,
          }}
        />
        {/* End Google tag (gtag.js) */}

        {/* Global Organization & WebSite Structured Data for Search Engines & SEO tools */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://arabiangratings.com/#organization",
                  "name": "Arabian Gratings",
                  "url": "https://arabiangratings.com",
                  "logo": "https://arabiangratings.com/icon.png",
                  "description": "Leading manufacturer and supplier of industrial gratings, FRP/GRP products, steel gratings, and access covers in Saudi Arabia and the GCC.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "SA",
                    "addressRegion": "Riyadh & Eastern Province"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "sales",
                    "email": "sales@arabiangratings.com"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://arabiangratings.com/#website",
                  "url": "https://arabiangratings.com",
                  "name": "Arabian Gratings Saudi Arabia",
                  "publisher": {
                    "@id": "https://arabiangratings.com/#organization"
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MLMZNR95"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

