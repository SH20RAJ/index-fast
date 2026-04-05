const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indexfast.co";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>IndexFast</ShortName>
  <Description>Search IndexFast guides, docs, and SEO resources.</Description>
  <Tags>indexing seo indexnow bing</Tags>
  <Contact>support@indexfast.co</Contact>
  <Url type="text/html" method="get" template="${siteUrl}/blog?query={searchTerms}"/>
  <Image height="32" width="32" type="image/png">${siteUrl}/icon-32x32.png</Image>
  <Developer>IndexFast</Developer>
  <Attribution>IndexFast</Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>en-us</Language>
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
</OpenSearchDescription>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
