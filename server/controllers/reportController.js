import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import nodemailer from 'nodemailer';

    //setup email noti
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "58c063ecf0597d",
          pass: "7b4425baad9cfb"
        }
      });

const createReport = (req, res, next) => {

  // Validate request
  if (!req.body.title || !req.body.description || !req.body.date || !req.body.location || !req.body.category ) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  var media = "";

  for (let index = 0; index < req.files.length; index++) {

    if(index === 0) media = req.files[0].filename;
    else media = media.concat(",",req.files[index].filename);
    
  }

  // Create
  const report = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    category: req.body.category,
    location: req.body.location,
    status: req.body.status,
    media: media,
    verified_comment: req.body.verified_comment,
    in_progress_comment: req.body.in_progress_comment,
    solved_comment: req.body.solved_comment,
    rejected_comment: req.body.rejected_comment,
    verified_time: req.body.verified_time,
    in_progress_time: req.body.in_progress_time,
    solved_time: req.body.solved_time,
    rejected_time: req.body.rejected_time,
    userId: req.body.userId
  };

  // Save Tutorial in the database
  Report.create(report)
    .then(data => {
      res.send(data);

      User.findOne({ where : {
        id: data.dataValues.userId, 
      }}).then(response => {

        const message = {
          from: "system@myrecycle.com",
          to: response.dataValues.email,
          subject: "Thank you for filing report to MyRecycle",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Report Notification</title>
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
                .content-detail-div .detail-part{
                  width:48%;
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
                        <h3>Thank you for filing report using MyRecycle!</h3>
                      </div>
                  </div>
              </section>
              <section class="content-section">
                <div class="content-div">
                  <h3>You have filed a report through MyRecycle. Here is the content of your report.</h3>
                  <div class="content-detail-div">
                    <div class="detail-part detail-part-1">
                      <p>Report ID: ${data.dataValues.id}</p>
                      <p>Title: ${data.dataValues.title}</p>
                      <p>Description: ${data.dataValues.description}</p>      
                    </div>
                    <div class="detail-part detail-part-2">
                      <p>Date: ${data.dataValues.date}</p>        
                      <p>Category: ${data.dataValues.category}</p>        
                      <p>Location: ${data.dataValues.location}</p>        
                      <p>Status: ${data.dataValues.status}</p>    
                    </div>
                  </div>
                  <p>Thank you for your reporting. Your report will be reviwed by JPSPN officers within 3 days. There will be email notification once there is update on the case.</p>
                </div>
              </section>
          </body>
          </html>`
        }
        
        // send mail with defined transport object
        transporter.sendMail(message, function(err, info) {
          if (err) console.log(err); 
          else console.log(info);
        })


      })
      .catch(err => {
        console.log(err);
      });
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the report."
      });
    });    

};

const getReport = (req, res, next) => {

        Report.findAll()
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving reports."
              });
        });

};

const getReportByStatus = (req, res, next) => {

  Report.findAll({ where : {
      status: req.params.status
  }})
  .then(data => {
      res.send(JSON.stringify(data));        
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports."
        });
  });

};

const getReportById = (req, res, next) => {

  Report.findAll({ where : {
      userId: req.params.id
  }})
  .then(data => {
      res.send(JSON.stringify(data));        
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports."
        });
  });

};

const getReportByIdStatus = (req, res, next) => {

  Report.findAll({ where : {
      status: req.params.status,
      userId: req.params.id
  }})
  .then(data => {
      res.send(JSON.stringify(data));        
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports."
        });
  });

};




const updateReportByStatus = (req, res, next) => {

  let target = req.params.id.split(",");
  // Save product in the database
  Report.update(
  {
    status:req.body.status,
    verified_comment: req.body.verified_comment,
    in_progress_comment: req.body.in_progress_comment,
    solved_comment: req.body.solved_comment,
    rejected_comment: req.body.rejected_comment,
    verified_time: req.body.verified_time,
    in_progress_time: req.body.in_progress_time,
    solved_time: req.body.solved_time,
    rejected_time: req.body.rejected_time,
  }, {returning:true, where: {id:[target]}})
    .then(data => {
      res.send(data);

      for (let index = 0; index < target.length; index++) {

        Report.findOne({ where : {
          id: target[index], 
        }}).then(reportResponse => {
  
          User.findOne({ where : {
            id: reportResponse.dataValues.userId, 
          }}).then(userResponse => {
  
            const message = {
              from: "system@myrecycle.com",
              to: userResponse.dataValues.email,
              subject: `Your report ${target[index]} is ${req.body.status}`,
              html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Report Notification</title>
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
                    .content-detail-div .detail-part{
                      width:48%;
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
                            <h3>Your report ${target[index]} is ${req.body.status}!</h3>
                          </div>
                      </div>
                  </section>
                  <section class="content-section">
                    <div class="content-div">
                      <h3>Here is the response from JPSPN.</h3>
                      <div class="content-detail-div">
                      <div class="detail-part detail-part-1">
                        <p>Report ID: ${target[index]}</p>
                        <p>Title: ${reportResponse.dataValues.title}</p>
                        <p>Description: ${reportResponse.dataValues.description}</p>      
                        <p>Date: ${reportResponse.dataValues.date}</p>        
                        <p>Category: ${reportResponse.dataValues.category}</p>        
                        <p>Location: ${reportResponse.dataValues.location}</p>        
                        <p>Status: ${reportResponse.dataValues.status}</p>    
                      </div>
                      <div class="detail-part detail-part-2">
                        <p>Verified Comment: ${reportResponse.verified_comment?reportResponse.verified_comment:'-'}</p>
                        <p>Verified Time: ${reportResponse.verified_time?reportResponse.verified_time:'-'}</p>
                        <p>In Progress Comment: ${reportResponse.in_progress_comment?reportResponse.in_progress_comment:'-'}</p>    
                        <p>In Progress Time: ${reportResponse.in_progress_time?reportResponse.in_progress_time:'-'}</p>     
                        <p>Approved Comment: ${reportResponse.approved_comment?reportResponse.approved_comment:'-'}</p>
                        <p>Approved Time: ${reportResponse.approved_time?reportResponse.approved_time:'-'}</p>
                        <p>Rejected Comment: ${reportResponse.rejected_comment?reportResponse.rejected_comment:'-'}</p>    
                        <p>Rejected Time: ${reportResponse.rejected_time?reportResponse.rejected_time:'-'}</p>  
                      </div>
                      </div>
                      <p>Please kindly send an email back if there is any mistake. Thank you for using MyRecycle's report system.</p>
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
                console.log(info);
              }
            })
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the report."
            });
          });
  
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the report."
          });
        });
        
      }



    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the report."
      });
    });
  }

const updateReportById = (req, res, next) => {

  // Validate request
  if (!req.body.title || !req.body.description || !req.body.date || !req.body.location || !req.body.category) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save Tutorial in the database
  Report.update(
  {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    category: req.body.category,
    location: req.body.location,
    status: req.body.status,
    media: req.body.media,
    verified_comment: req.body.verified_comment,
    in_progress_comment: req.body.in_progress_comment,
    solved_comment: req.body.solved_comment,
    rejected_comment: req.body.rejected_comment,
    verified_time: req.body.verified_time,
    in_progress_time: req.body.in_progress_time,
    solved_time: req.body.solved_time,
    rejected_time: req.body.rejected_time,
  }, {returning:true, where: {id:req.body.id}})
    .then(data => {
      res.send(data);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the report."
      });
    });

};

const deleteReportById = (req, res, next) => {

  let target = req.params.id.split(",");
  Report.destroy({ where : {
      id: [target]
  }})
  .then(data => {
      res.send(JSON.stringify(data));
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports."
        });
  });

};






export { createReport, getReport, getReportById, getReportByStatus, getReportByIdStatus, updateReportByStatus, updateReportById, deleteReportById };