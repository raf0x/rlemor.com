/**
 * Search-readable identity signals shared by public pages.
 * Keep these statements aligned with visible copy and public case studies.
 */
const identity = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rlemor.com/#website",
      "url": "https://rlemor.com/",
      "name": "Rafael Lemor",
      "description": "Rafael Lemor's professional experience in global sports operations, enterprise Customer Success, and independently built products.",
      "inLanguage": "en-US",
      "publisher": { "@id": "https://rlemor.com/#rafael" }
    },
    {
      "@type": "Person",
      "@id": "https://rlemor.com/#rafael",
      "name": "Rafael Lemor",
      "url": "https://rlemor.com/",
      "image": "https://rlemor.com/images/rafael-portrait.jpg",
      "description": "Miami-based professional experienced in FIFA commercial partner ticketing and CRM, enterprise account management, Customer Success, and AI-assisted independent product building.",
      "homeLocation": { "@type": "Place", "name": "Miami, Florida" },
      "knowsAbout": [
        "Customer Success",
        "Enterprise account management",
        "Global sports event operations",
        "Commercial partner ticketing",
        "Customer relationship management",
        "AI-assisted product development",
        "Product thinking"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/rlemor",
        "https://github.com/raf0x"
      ],
      "mainEntityOfPage": "https://rlemor.com/about"
    }
  ]
};

export default function SiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(identity).replace(/</g, "\\u003c") }}
    />
  );
}
