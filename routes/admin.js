var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')


var adminLogin = {
  name: 'Admin',
  emailId: 'admin@gmail.com',
  password: 'admin'
}


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    userHelpers.getAllUsers().then((users)=>{
     
      res.render('admin/admin-home',{users});
    })
  }
  else{
    res.redirect('/admin/login')
  }
});

router.get('/login',(req,res)=>{
  if(req.session.login){
    res.redirect('/admin')
  }else{

    res.render('admin/admin-login')
  }
});

router.post('/login', (req, res) => {
   if (adminLogin.emailId == req.body.email && adminLogin.password == req.body.password) {
    req.session.login = true
    req.session.email = req.body.email
    req.session.password = req.session.password
    req.session.name = adminLogin.name
    let data = req.session.name
    res.redirect('/admin')
  }
   else {
    var error = 'Invalid username or password..'
    res.render('admin/admin-login',{error})
  }
})

router.get('/add-users',(req,res)=>{
  if(req.session.login)
  {
    if(req.session.addUser){
    req.session.addUser=null
    var alert="User Added Sucessfully"
    
    res.render('admin/add-users',{alert})
  }
  else{
    res.render('admin/add-users')
  }
 }
 else{
   res.redirect('/admin/login')
 }
})

router.post('/add-users',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.status){
      req.session.addUser=true

      res.redirect('/admin/add-users')
    }
    res.redirect('/admin/add-users')

  })
})

router.get('/logout',(req,res)=>{
  req.session.login=null
  res.redirect('/admin/login')
})

router.get('/delete-user/:id',(req,res)=>{
 
  let userid=req.params.id
  console.log(userid);
  userHelpers.deleteUser(userid).then((response)=>{
    res.redirect('/admin')
  })
 
})

router.get('/edit-user/:id',async(req,res)=>{
  let edituser=await userHelpers.getUserDetails(req.params.id)
  console.log(edituser);
  res.render('admin/edit-user',{edituser})
})

router.post('/edit-user/:id',(req,res)=>{
  userHelpers.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })

})



// router.get("/block/:id",function(req,res){

//   id=req.params.id

//  userHelpers.block(id).then((response)=>{
//      if(response.status){
//          console.log(response.status);

//     res.redirect("/admin/")
//   }
//  })

// })



// router.get("/unblock/:id",function(req,res){

//  id=req.params.id

//  userHelpers.unblock(id).then((response)=>{
//      if(response.status){
//          console.log(response.status);

//     res.redirect("/admin/")
//   }
//  })

// })



module.exports = router;
