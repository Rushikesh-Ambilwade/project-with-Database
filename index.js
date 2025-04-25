const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended :true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
let port=8080;

 const connection=mysql.createConnection({
     host:'localhost',
     user:'root',
    database:'delta_app',
    password:'Rushi@123'
 })
 let getRandomUser=()=> {
  return [
   faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
     faker.internet.email(),
    faker.internet.password(),
  ];
  };

//  let q="SHOW TABLES";
// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let user=["123","123_newuser","abc@gmail.com","abc"];
// let users=[["123b","123_newuserb","abc@gmail.comb","abcb"],
//  ["123c","123_newuserc","abc@gmail.comc","abcc"]];

// let data=[];
// for(let i=0;i<=100;i++){
//   data.push(getRandomUser());
// }
 
  // console.log(getRandomUser());//to generate the fake data
  app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
  })

  //Home Route
  app.get("/",(req,res)=>{
    let q="SELECT COUNT(*) FROM user";
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let count=result[0]["COUNT(*)"];
        res.render("home.ejs",{count});
      });
    }
    catch(err){
      res.send("Some error in DB");
    }
    
  })
//Show Route
  app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        //console.log(result);
       // res.send(result);
       res.render("showuser.ejs",{result});
      });
    }
    catch(err){
      res.send("some error in the DB");
    }
  })
  //Edit Route
    app.get("/user/:id/edit",(req,res)=>{
      let{id}=req.params;
      let q=`SELECT * FROM user WHERE id='${id}'`;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          let user=result[0];
          res.render("edit.ejs",{user});
        })
      }
      catch(err){
        res.send("some err in DB");
      }
    })
  //UPDATE Route
  app.patch("/user/:id",(req,res)=>{
    let{id}=req.params;
      let q=`SELECT * FROM user WHERE id='${id}'`;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          let{password:formPass,username:newUser}=req.body;
          let user=result[0];
          if(formPass!=user.password){
            res.send("Wrong Password");
          }else{
            let q2=`UPDATE user SET username='${newUser}' WHERE id='${id}'`;
            connection.query(q2,(err,result)=>{
              if(err) throw err;
              res.redirect ("/user");
            });

          }
          
          
          
        })
      }
      catch(err){
        res.send("some err in DB");
      }
    
  })
//DELETE USER
  app.get("/user/:id/delete",(req,res)=>{
    let{id}=req.params;
    let q=`DELETE FROM user WHERE id='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        res.redirect("/user");

        
      })
    }
    catch(err){
      res.send("Some error in DB");
    }

  })
  //ADD USER
  app.post("/user/add",(req,res)=>{
    res.render("add.ejs");
  })

  app.post("/user/submit",(req,res)=>{
    let{id,username,email,password}=req.body;
    let q=`INSERT INTO user(id,username,email,password) VALUES('${id}','${username}','${email}','${password}')`;
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        res.redirect("/user");
      })
    }
    catch(err){
      res.send("some error in DB")
    }
  })


  // try{
  //   connection.query(q,[data],(err,result)=>{
  //     if(err) throw err;
  //     console.log(result);
  //     // console.log(result.length);
  //     // console.log(result[0]);
  //     // console.log(result[1]);
  //   })
  //  }
  //  catch(err){
  //   console.log(err);
  //  }
  //  connection.end();