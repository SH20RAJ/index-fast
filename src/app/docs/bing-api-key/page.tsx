import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BingApiKeyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="rounded-3xl border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">How to Get a Bing Webmaster API Key</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>
            The Bing Webmaster API key allows IndexFast to submit your URLs directly to Bing every day, ensuring your latest content is indexed as soon as possible.
          </p>
          <h3>Steps to get your Bing API key:</h3>
          <ol>
            <li>Go to the <a href="https://www.bing.com/webmasters/" target="_blank" rel="noopener noreferrer">Bing Webmaster Tools</a> website and sign in.</li>
            <li>Select your website from the list of sites.</li>
            <li>Click on the <strong>Settings</strong> (gear icon) in the top right corner.</li>
            <li>Select <strong>API Access</strong> from the menu.</li>
            <li>Click on <strong>API Key</strong>.</li>
            <li>If you haven't generated a key yet, click <strong>Generate</strong>.</li>
            <li>Copy your API key and paste it into IndexFast.</li>
          </ol>
          <p>
            Note: You can skip this step and still use IndexNow. Adding a Bing API key provides an additional direct way to ensure Bing is aware of your new content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
