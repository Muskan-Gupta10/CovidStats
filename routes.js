const {tallyModel}=require('./connector')
const express=require('express')
//const data=require('./data')
const router=express.Router()

router.get('/totalRecovered',(req,resp)=>{
    tallyModel.aggregate([
        {
            $group:{
                _id:null,
                recovered:{$sum:'$recovered'}
            }
        }
    ])
    .then((res)=>resp.status(200).send({data:{_id:'total',recovered:res[0].recovered}}))
})

router.get('/totalActive',(req,resp)=>{
    tallyModel.aggregate([
        {
          $group: {
            _id: null,
            active: { $sum: { $subtract: ["$infected", "$recovered"] } }
          }
        },
        {
          $project: {
            _id: "total",
            active: 1
          }
        }
      ])
    .then((data)=>resp.status(200).send({data}))
})

router.get('/totalDeath',(req,resp)=>{
    tallyModel.aggregate([
            {
                $group:{
                    _id:null,
                    death:{$sum:'$death'}
                }
            }
        ])
        .then((res)=>resp.status(200).send({data:{_id:'total',death:res[0].death}}))
    
})

router.get('/hotspotStates',(req,resp)=>{
    tallyModel.aggregate([
        {
          $addFields: {
            rate: {
              $round: [
                {
                  $divide: [
                    { $subtract: ["$infected", "$recovered"] },"$infected"
                    ]
                },
                5 ]}}
        },
        {
          $match: {
            rate: { $gt: 0.1 }
          }
        },
        {
          $project: {
            _id: 0,
            state: "$state",
            rate: 1
          }
        }
    ])
    .then((data)=>resp.status(200).send({data}))
})
 
router.get('/healthyStates',(req,resp)=>{
    tallyModel.aggregate([
        {
            $addFields:{
                mortality: {$round:[{$divide:['$death','$infected']},5]}
            }
        },
        {
            $match: {mortality:{$lt:.005}}
        },
        {
            $project:{
                _id:0,
                state:'$state',
                mortality:1
            }
        }
    ])
    .then((data)=>resp.status(200).send({data}))
})
module.exports=router

  