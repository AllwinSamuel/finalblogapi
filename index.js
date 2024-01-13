const express = require("express")
require("dotenv").config()
const cors = require("cors")
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const userModel = require("./models/userModel")
const commentModel = require("./models/comment")
const bioModel = require("./models/bio")
const bcrypt = require("bcryptjs")

const postModel = require("./models/postModel")
const salt = bcrypt.genSaltSync(10);


app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000" , "https://anblogland.netlify.app"]
}));

try{
mongoose.connect("mongodb+srv://allwinsamuel0124:BIz0pb2q8Y8Y6Yxg@cluster0.74f6v4w.mongodb.net/?retryWrites=true&w=majority")}catch(e){
    
}

app.get("/",(req,res)=>{
  res.json("message:BAD REQUEST")
})
app.post("/profile",async(req,res)=>{
  try{
   const {author,downloadURL,about} = req.body
 
   const first = true
   
 await bioModel.create({
  author,about,profile : downloadURL,first
 }) 
 res.json("ok")}
 

catch(e){
  res.json("failed")
}

})

app.put("/editprofile",async(req,res)=>{
  try{
   const {author,downloadURL,about,id} = req.body
   
 
   
   
 await bioModel.findByIdAndUpdate({_id:id},{
  author,about,profile : downloadURL
 }) 
 res.json("ok")}
 

catch(e){
  res.json("failed")
}

})


app.post("/info",async(req,res)=>{
  try{
   const {author} = req.body
  
   
 const info = await bioModel.findOne({
  author
 }) 
 
 res.json(info)
 

}catch(e){
  res.json("failed")
}

})

app.post("/user" , async(req,res)=>{
    const {username,password} = req.body;

try{
    const user = await userModel.create({
        username,
        password:bcrypt.hashSync(password,salt)})
    res.json(user)
}
catch(e){
  res.json("failed")
}
})

app.post("/userlogin" , async(req,res)=>{
    const {username,password} = req.body;

try{
    const userlogin = await userModel.findOne({
        username
        })
        if(userlogin){
            const passok = bcrypt.compareSync(password , userlogin.password)
            if(passok){
                res.json({data:"ok",user:username})
            }
            else{
                res.json("notok")
            }
        }else{
            res.json("not")
        }
    
}
catch(e){
  res.json("failed")
}
})

app.post("/create" ,(req,res)=>{
  try{  
    
    
   const{author,title,summary,content,downloadURL} = req.body
   console.log(req.body)
   
    const post = postModel.create({
        title,summary,content,author,cover:downloadURL
    })
    res.json("ok")
    
}
catch(e){
  res.json("failed")
}
})

app.get("/posts" ,async(req,res)=>{
    try{  
      const posts = await postModel.find().limit(20).sort({createdAt : -1})
    
      res.json(posts)
      
  }
  catch(e){
    res.json("failed")
  }
  })

  app.get("/post/:id" ,async(req,res)=>{
    try{  
        const {id} = req.params
      const post = await postModel.findById(id)
    
      res.json(post)
      
  }
  catch(e){
    res.json("failed")
  }
  })

   app.put("/editpost/:id" ,async(req,res)=>{
    try{  
        const {id} = req.params
       
       

            const {title,content,author,summary,downloadURL} = req.body
            
          const post = await postModel.findByIdAndUpdate({_id: id},{
            title,content,summary,author,cover : downloadURL})
        
          res.json("cover yes")
        }
       
    catch(e){
    res.json("failed")
  }
  }) 

  app.delete("/delete/:id" ,async(req,res)=>{
    try{  
        const {id} = req.params
    await postModel.findByIdAndDelete({_id:id})
    
      res.json("deleted")
       
  }
  catch(e){
    res.json("failed")
  }
  })

  app.post("/comment" ,async(req,res)=>{
    try{  
        const {postId,author,comment} = req.body
   const comments = await commentModel.create({postId,author,comment})
    
      res.json("added")
       
  }
  catch(e){
    res.json("failed")
  }
  })

  app.get("/getcomments" ,async(req,res)=>{
    try{  
        
   const comments = await commentModel.find().sort({
    createdAt : -1
   })
    
      res.json(comments)
       
  }
  catch(e){
    res.json("failed")
  }
  })


app.listen(PORT,()=>{console.log("server running!!")})