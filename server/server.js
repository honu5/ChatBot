import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {getGeminiResponse} from "../utils/geminiWrapper.js"

let ans=[];
let topics=[];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)

const app=express();
const port=3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));


app.get("/", (req, res) => {
    res.render("home");
});



app.post("/other",async(req,res)=>{
    const message=req.body.user_input;
    const response=await getGeminiResponse(message);  
    ans=[]
if (! topics.includes(message)) {
        topics.push(message.slice(0,30));
    }
    console.log(topics)
    ans.push({message,response})

    res.render("other", { ans,topics});
})

app.post("/chat", async (req, res) => {
    const message = req.body.user_input;
    const response = await getGeminiResponse(message);
    ans.push({message,response})
    
    res.render("other", { ans,topics});
})

app.get("/home",(req,res)=>{

    res.render("home",{topics})
})

 
app.get('/profile',(req,res)=>{
    res.render("profile.ejs")
})

app.listen(port,()=>{
    console.log(`the server is running http://localhost:3000 `)
})



    

