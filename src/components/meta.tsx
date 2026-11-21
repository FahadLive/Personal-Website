import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

function MetaComponent({
  pageTitle,
  pageDescription,
  pagePreview,
  noIndex,
}: {
  pageTitle: string;
  pageDescription: string;
  pagePreview?: string | null;
  noIndex?: boolean;
}) {
  const location = useLocation();
  const baseUrl = "https://justfahad.me";
  const canonicalUrl = baseUrl + location.pathname;

  const imageUrl = pagePreview
    ? `${baseUrl}${pagePreview.startsWith("/") ? "" : "/"}${pagePreview}`
    : `${baseUrl}/opengraph-image.jpg`;

  return (
    <Helmet>
      <title>{pageTitle ? `${pageTitle} | Fahad` : "Fahad"}</title>
      <meta property="og:type" content="website" />
      {noIndex && <meta name="robots" content="noindex" />}

      <meta name="description" content={pageDescription} />
      <meta
        property="og:title"
        content={pageTitle ? `${pageTitle} | Fahad` : "Fahad"}
      />
      <meta
        property="og:description"
        content={
          pageDescription
            ? pageDescription
            : "Fahad’s personal website showcasing projects, blogs, and insights on technology, design, and development."
        }
      />
      <meta property="og:image" content={imageUrl} />

      <meta property="og:url" content={canonicalUrl} />

      <link rel="canonical" href={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${pageTitle} | Fahad`} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

export default MetaComponent;
