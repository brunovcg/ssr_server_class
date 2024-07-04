const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const port = 3001;

const messages = [];

const server = http.createServer(async (req, res) => {
  if (req.method === "POST") {
    let body = "";

    await new Promise((resolve) => {
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const params = new URLSearchParams(body);

        messages.push({
          text: params.get("message"),
          author: params.get("name"),
          date: new Date(),
        });

        resolve();
      });
    });
  }

  const data = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");

  //   SERVER SIDE RENDERING
  const html = data.replace(
    "{{MESSAGES}}",
    messages
      .map(
        (item) =>
          `<p>${item.author}: ${item.text} - ${item.date.toLocaleString()}</p>`
      )
      .join("")
  );
  //   SERVER SIDE RENDERING

  res.writeHead(200, { "Content-Type": "text/html" });

  res.write(html);

  res.end();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
