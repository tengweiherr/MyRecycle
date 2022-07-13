import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";
import Batch from "../models/batchModel.js";
import MRPoint from "../models/mrpointModel.js";
import nodemailer from 'nodemailer';

      //setup email noti
      var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "58c063ecf0597d",
          pass: "7b4425baad9cfb"
        }
      });

const createReward = (req, res, next) => {

    // Validate request
    if (!req.body.batch_id ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create
    const reward = {
      batch_id: req.body.batch_id,
      redeemed: false,
      redeem_time: req.body.redeem_time
    };
  
    // Save reward in the database
    Reward.create(reward)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the reward."
        });
      });
  
  };

  const getReward = (req, res, next) => {
  
        Reward.findAll()
          .then(data => {
              console.log(JSON.stringify(data));
              res.send(JSON.stringify(data));              
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving users."
                });
          });
  
  };

  const getRewardByBatch = (req, res, next) => {
  
    Reward.findAll({ where : {
      batch_id: req.params.batch_id
  }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving users."
          });
    });
};

const updateRewardById = (req, res, next) => {

    // Validate request
    if (!req.params.reward_id || !req.body.batch_id || !req.body.redeemed) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Save reward in the database
    Reward.update(
    {
      batch_id: req.body.batch_id,
      redeemed: req.body.redeemed,
      user_id: req.body.user_id,
      redeem_time: req.body.redeem_time,
    }, {returning:true, where: {reward_id:req.params.reward_id}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the reward."
        });
      });
  };


  const redeemReward = (req, res, next) => {

    // Validate request
    if ( !req.body.batch_id || !req.body.redeem_time || !req.body.mr_points || !req.body.user_id || !req.body.email ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    Reward.findOne({
      where: {
        batch_id: req.body.batch_id,
        redeemed: false
       }
    })
    .then(data => {
        const message = {
          from: "system@myrecycle.com",
          to: req.body.email,
          subject: "Reward Redeemed from MyRecycle!",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>MyRecycle Reward</title>
              <style>
                body{
                  background-color: #1FAA8F;
                  font-family:verdana;
                }
                .header-div{
                  width:100%;
                  height:200px;
                  overflow: hidden;
                  display: flex;
                  justify-content: center;
                  align-content: center;
                }
                .header-div img{
                  object-fit: cover;
                }
                .header-title{
                  margin:0 auto;
                  position:absolute;
                  padding: 0 50px;
                  text-align: center;
                }
                .header-title h3{
                  font-size:2.5rem;
                }
                .header-title h1{
                  font-size:4rem;
                }
                .content-section{
                  background-color: #f6f6f6;
                  padding:1.5rem;
                }
                .content-div{
                  padding: 30px 0 60px 0;
                  text-align:center;
                  display:flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                }
                .content-detail-div{
                  padding: 30px 0 20px 0;
                  text-align: justify;
                  display:flex;
                  flex-direction:row;
                  justify-content: space-between;
                  width: 100%;
                }
                .content-detail-div p{
                  padding-bottom: 1.5rem;
                  border-bottom: solid 1px rgba(0,0,0,0.1);
                }
                .content-detail-div p:last-child{
                  border-bottom: solid 1px rgba(0,0,0,0);
                }
              </style>
          </head>
          <body>
              <section class="header-section">
                  <div class="header-div">
                      <div class="header-title">
                        <h3>Reward redeemed in MyRecycle!</h3>
                      </div>
                  </div>
              </section>
              <section class="content-section">
                <div class="content-div">
                  <h3>You have redeemed a reward through MyRecycle. Here is the content of your reward.</h3>
                  <div class="content-detail-div">
                    <div class="detail-part">
                      <p><strong>Voucher: ${data.dataValues.reward_id}</strong></p>
                      <p>Redeemed Time: ${req.body.redeem_time}</p> 
                      <p>Reward Cost: ${req.body.rewards_cost}</p>     
                    </div>
                  </div>
                  <p>Thank you using MyRecycle. Please keep on recycle and earn more rewards!</p>
                </div>
              </section>
          </body>
          </html>`
        }
        
        // send mail with defined transport object
        transporter.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            // console.log(info);
          }
        })
    
      Reward.update(
        {
          redeemed: true,
          user_id: req.body.user_id,
          redeem_time: req.body.redeem_time,
        }, {returning:true, where: {reward_id:data.dataValues.reward_id}})
          .then(data => {
            // res.send(data);

            User.update(
              {
                mr_points: req.body.mr_points,
              }, {returning:true, where: {id:req.body.user_id}})
              .then(data => {
                  // res.send(data);

                  Batch.update(
                    {
                      amount_left: req.body.amount_left,
                    }, {returning:true, where: {batch_id:req.body.batch_id}})
                      .then(data => {
                        // res.send(data);
                            // Save Recycle in the database
                            MRPoint.create({
                              user_id: req.body.user_id,
                              points_given: req.body.rewards_cost,
                              time: req.body.redeem_time,
                              event: "redeem"
                            })
                            .then(data => {
                              // res.send(data);
                            })
                            .catch(err => {
                              res.status(500).send({
                                message:
                                  err.message || "Some error occurred while creating the Recycle."
                              });
                            });
                      })
                      .catch(err => {
                        res.status(500).send({
                          message:
                            err.message || "Some error occurred while creating the reward."
                        });
                      });
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the reward."
                });
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the reward."
            });
          });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward."
      });
    });

    // Update mr points in the database
  };

  const deleteRewardById = (req, res, next) => {

    let target = req.params.reward_id.split(",");
    console.log(target);
    Reward.destroy({ where : {
        reward_id: [target]
    }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Rewards."
          });
    });
  
  };

  export { createReward, getReward, getRewardByBatch, updateRewardById, deleteRewardById, redeemReward };