var express = require('express');
const { response } = require('../app');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')


/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  if(user){
    res.render('user/user-home',{user});
  }else{
    res.redirect('/login')
  }
  console.log(user);
  
});


router.get('/login',function(req,res,next)
{
  
    if(req.session.user){
    
    res.redirect('/')
   }
   else{
    
    res.render('login',{"loginErr":req.session.loginErr});  
    req.session.loginErr=false
   }
  
});



router.get('/signup',(req,res,next)=>{

  res.render('signup');
});

router.post('/submited',(req,res)=>{
  
 userHelpers.doSignup(req.body).then((response)=>{
   res.redirect('/login')
 })
});

router.post('/logined',(req,res)=>
{
 userHelpers.doLogin(req.body).then((response)=>{
   if(response.status)
   {
     
     req.session.user=response.user
     res.redirect('/')
   }
   else{
     req.session.loginErr=true
     res.redirect('/login')
   }
 })
});

router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/login')
})

module.exports = router;
