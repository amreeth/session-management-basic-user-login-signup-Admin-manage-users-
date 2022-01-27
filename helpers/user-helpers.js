var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const async = require('hbs/lib/async')
const { reject } = require('bcrypt/promises')
const res = require('express/lib/response')
const ObjectId= require('mongodb').ObjectId
const { response } = require('express')

module.exports={
    doSignup:(userData)=>
    {
        return new Promise(async(resolve,reject)=>{

            userData.password= await bcrypt.hash(userData.password,10)
           await db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve({status:true})
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user)
            {
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })     
            }
            else{
                console.log('login failed');
                resolve({status:false})
            }

        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userid)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({_id:ObjectId(userid)}).then((response)=>{
            resolve(response)
        })
            
        })
    },
    getUserDetails:(userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(userid)}).then((edituser)=>{
                resolve(edituser)
            })
        })
    },
    updateUser:(userid,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userid)},{
                $set:{
                    name:userDetails.name,
                    email:userDetails.email
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
  

}