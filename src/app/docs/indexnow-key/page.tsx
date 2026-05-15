import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IndexNowKeyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="rounded-3xl border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">How to Create an IndexNow Key</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>
            IndexNow is a protocol that allows website owners to instantly notify search engines about recent content changes on their website.
          </p>
          <h3>Steps to create and set up your IndexNow key:</h3>
          <ol>
            <li><strong>Generate a Key</strong>: Your key should be a string of at least 8 to 128 characters. It can include letters (a-z, A-Z), numbers (0-9), and dashes (-).</li>
            <li><strong>Create a Text File</strong>: Create a plain text file named with your key (e.g., <code>abc123xyz.txt</code>).</li>
            <li><strong>Add the Key to the File</strong>: The only content in the text file should be the key itself.</li>
            <li><strong>Upload to Root</strong>: Upload this text file to the root directory of your website (e.g., <code>https://example.com/abc123xyz.txt</code>).</li>
            <li><strong>Verify in IndexFast</strong>: Enter your key and the URL of the text file in IndexFast to verify ownership.</li>
          </ol>
          <p>
            By setting up IndexNow, you enable IndexFast to submit your URLs to search engines like Bing, Yandex, and Seznam instantly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

