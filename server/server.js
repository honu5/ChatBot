import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getGeminiResponse } from "../utils/geminiWrapper.js";
import { marked } from "marked";

let ans = [];
let topics = [];
let conversations = {}; // { topicId: [{message, response}, ...] }

let id = 0;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.get("/", (req, res) => {
  res.render("home", { topics });
});

app.post("/other", async (req, res) => {
  const message = req.body.user_input;

  let topicObj = topics.find(t => t.title === message.slice(0, 30));
  if (!topicObj) {
    topicObj = { id: id++, title: message.slice(0, 30) };
    topics.push(topicObj);
    conversations[topicObj.id] = [];
  }

  const rresponse = await getGeminiResponse(message, conversations[topicObj.id] || []);
  const response = marked.parse(rresponse);

  conversations[topicObj.id].push({ message, response });

  // Pass topicId when rendering other.ejs to fix NaN issue
  res.render("other", { ans: conversations[topicObj.id], topics, topicId: topicObj.id });
});

app.post("/chat", async (req, res) => {
  const message = req.body.user_input;
  const topicId = parseInt(req.body.topic_id);

  if (!conversations[topicId]) conversations[topicId] = [];

  const rresponse = await getGeminiResponse(message, conversations[topicId]);
  const response = marked.parse(rresponse);

  conversations[topicId].push({ message, response });

  res.redirect(`/chat/${topicId}`);
});

app.get("/home", (req, res) => {
  res.render("home", { topics });
});

app.get("/chat/:id", (req, res) => {
  const topicId = parseInt(req.params.id);  // fix param name here from topicId to id
  res.render("other", { ans: conversations[topicId] || [], topics, topicId });
});

app.get('/profile', (req, res) => {
  res.render("profile.ejs");
});

app.listen(port, () => {
  console.log(`the server is running http://localhost:3000`);
});
