const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  readAndDelete,
} = require("./helpers/fsUtils");
const dbRoute = require("./db/db.json");
const { on } = require("events");

const PORT = process.env.port || 3001;
const app = express();

const publicDirectoryPath = path.join(__dirname, "/public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "/notes.html"));
});

app.get("/api/notes", (req, res) => {
  // res.json('./db/db.json')

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`note added successfully`);
  } else {
    res.error("Error in adding note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  readAndDelete(req.params.id, "./db/db.json");
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "/index.html"));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
