import { IncomingForm } from "formidable";

export async function POST(req: Request) {
  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return new Response("Error parsing form", { status: 500 });
    }

    console.log(fields, files);
    return new Response(JSON.stringify({ success: true }));
  });
}
