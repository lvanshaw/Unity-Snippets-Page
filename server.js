const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Specify the upload directory

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static('uploads')); 


app.get("/snippets", (req, res) => {
  fs.readFile("snippets.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const snippets = JSON.parse(data) || [];
      res.json(snippets);
    }
  });
});

app.post('/snippets', upload.array('images'), (req, res) => {
    const { title, content } = req.body;
    const images = req.files;

    if (!title || !content) {
        res.status(400).json({ error: 'Bad Request - Title and content are required.' });
        return;
    }

    const imagePaths = images.map(image => `uploads/${image.filename}`);

    fs.readFile('snippets.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const snippets = JSON.parse(data) || [];
            snippets.push({ title, content, images: imagePaths });

            fs.writeFile('snippets.json', JSON.stringify(snippets), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
});

app.delete("/snippets/:index", (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile("snippets.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const snippets = JSON.parse(data) || [];
      snippets.splice(index, 1);

      fs.writeFile("snippets.json", JSON.stringify(snippets), "utf8", (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

app.get("/snippets/:search?", (req, res) => {
  fs.readFile("snippets.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      let snippets = JSON.parse(data) || [];

      // Check if there's a search query
      const searchQuery = req.params.search;
      if (searchQuery) {
        snippets = snippets.filter(
          (snippet) =>
            snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      res.json(snippets);
    }
  });
});

// ... (existing code)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
