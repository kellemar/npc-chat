import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          
          <meta property="og:title" content="NPC.AI" />
          
          <meta name="twitter:title" content="NPC.AI" />
          <meta
            name="twitter:description"
            content="NPC Companions for your DnD Campaigns."
          />
          
        </Head>
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
