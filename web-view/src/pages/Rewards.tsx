import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { string } from "yup";

const API_URL = process.env.API_URL;

const Rewards = () => {

  interface RewardType {
    reward_id: number;
    batch_id: number;
    redeemed: boolean;
    user_id: number;
    redeem_time: Date;
  }

  interface BatchType {
    batch_id: number;
    rewards_name: string;
    rewards_category: string;
    rewards_cost: number;
    amount_available: number;
    amount_left: number;
    media: any;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<RewardType>>([]);
  const [batchData, setBatchData] = useState<Array<BatchType>>([]);
  const [error, setError] = useState(null);

  // Current category
  const [status, setStatus] = useState("All");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Edit Reward
  const [newData, setNewData] = useState<RewardType>({reward_id:0, batch_id:0, redeemed:false, user_id: 0, redeem_time: new Date()});

  //Edit Batch
  const [newBatchData, setNewBatchData] = useState<BatchType>({batch_id:0,rewards_name:"",rewards_category:"Vouchers",rewards_cost:0,amount_available:0,amount_left:0,media:null});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      // setNewData({reward_id:0, batch_id:0, redeemed:false, user_id: 0, redeem_time: new Date()});
      setNewBatchData({batch_id:0,rewards_name:"",rewards_category:"Vouchers",rewards_cost:0,amount_available:0,amount_left:0,media:null});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'reward/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  }, [status]);

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'batch/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setBatchData(results);
      })
      .catch(err => {
        setError(err);
      });
  }, [status]);

  //Input inside Modal
  const handleNewDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "rewards_name":
        setNewBatchData((prevVal) => {
          return Object.assign({}, prevVal, { rewards_name: val }); 
        });       
        break;
      case "rewards_category":
        setNewBatchData((prevVal) => {
          return Object.assign({}, prevVal, { rewards_category: val }); 
        });       
        break;
      case "rewards_cost":
        setNewBatchData((prevVal) => {
          return Object.assign({}, prevVal, { rewards_cost: val }); 
        });       
        break;
      case "amount_available":
        setNewBatchData((prevVal) => {
          return Object.assign({}, prevVal, { amount_available: val, amount_left:val }); 
        });   
        break;
      case "amount_left":
        setNewBatchData((prevVal) => {
          return Object.assign({}, prevVal, { amount_left: val }); 
        });   
        break;
      case "media":
        if (event.target.files){
          if(event.target.files[0]){
            let media:any = event.target.files[0]?event.target.files[0]:null;
            setNewBatchData((prevVal) => {
              return Object.assign({}, prevVal, { media: media }); 
            });   
          }
        }
        break;                  
      default:
        break;
    }
  };

    //add report func
    const addItem = (action:string) => {

      var endpoint:string = "";

      let formdata = new FormData();
      formdata.append("batch_id", newBatchData.batch_id.toString())
      formdata.append("rewards_name", newBatchData.rewards_name)
      formdata.append("rewards_category", newBatchData.rewards_category)
      formdata.append("rewards_cost", newBatchData.rewards_cost.toString())
      formdata.append("amount_available", newBatchData.amount_available.toString())
      formdata.append("amount_left", newBatchData.amount_left.toString())
      let file = new File([newBatchData.media],newBatchData.media.name, {type: 'image/jpg'});
      formdata.append("media", file);

       // Display the values
       for (var value of formdata.values()) {
        console.log(value);
      }

      if (newBatchData.rewards_name !== "" || newBatchData.rewards_cost !== 0 || newBatchData.rewards_category !=="" ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'batch';
            break;
          // case "Update":
          //   endpoint = API_URL + 'batch/' + newData.reward_id;
          //   break;
          default:
            break;
        }

        fetch(endpoint, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            body: formdata,
          })
          .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log(jsonRes.message);
                } else {
                  setNewBatchData({batch_id:0,rewards_name:"",rewards_category:"Vouchers",rewards_cost:0,amount_available:0,amount_left:0,media:null});
                  console.log(jsonRes.message);
                  window.location.reload();
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    
      };        

    }

  const updateItem = (event:React.MouseEvent<HTMLElement>, reward_id:number, batch_id:number, redeemed:boolean, user_id:number, redeem_time:Date) => {
    event.preventDefault();
    setNewData({ reward_id:reward_id, batch_id:batch_id, redeemed:redeemed, user_id:user_id, redeem_time:new Date()});
    handleShow("Update");
  };

  //Checkboxes
    // This function will be triggered when a checkbox changes its state
    const selectItem = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedId = parseInt(event.target.value);
  
      // Check if "ids" contains "selectedIds"
      // If true, this checkbox is already checked
      // Otherwise, it is not selected yet
      if (ids.includes(selectedId)) {
        const newIds = ids.filter((id) => id !== selectedId);
        setIds(newIds);
      } else {
        const newIds = [...ids];
        newIds.push(selectedId);
        setIds(newIds);
      }
    };
  
    // This function will be called when the "REMOVE SELECTED USERS" is clicked
    const removeItems = () => {

      const payload = ids;
      fetch(API_URL + 'reward/' + payload, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        .then(async res => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                  console.log(jsonRes.message);
              } else {
                console.log(jsonRes.message);
                window.location.reload();
              }
          } catch (err) {
              console.log(err);
          };
      })
      .catch(err => {
          console.log(err);
      });
    };

  return (
    <>
    <Container>
        <h3>Rewards</h3>
        <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "all" ? "button active" : "button"} onClick={()=>setStatus("all")} >All</Button>
            <Button className={status == "redeemed" ? "button active" : "button"} onClick={()=>setStatus("redeemed")} >Redeemed</Button>
            <Button className={status == "not redeemed" ? "button active" : "button"} onClick={()=>setStatus("not redeemed")}>Not Redeemed</Button>
        </Col>
        </Row>
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Reward ID</th>
                <th>Batch ID</th>
                <th>Reward Name</th>
                <th>Redeemed</th>
                <th>Redeemed By</th> 
                <th>Time</th> 
                <th>Action</th>    
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:RewardType, index:number) => (
                    <tr key={`Rewards-${index}`} className={`Rewards-${index}`}>
                      <td className="reward_id">
                      <a href="#">{item.reward_id}</a> 
                      </td>
                      <td className="batch_id">
                        {item.batch_id}
                      </td>
                      <td className="reward_name">
                        {(batchData.find(x => x.batch_id === item.batch_id))?.rewards_name}
                      </td>
                      <td className="redeemed">
                        {item.redeemed ? "Yes" : "No"}
                      </td>
                      <td className="user_id">
                        {item.user_id}
                      </td>
                      <td className="redeem_time">
                        {item.redeem_time}
                      </td>
                      <td className="action">
                        
                      <Form.Check
                        type="checkbox"
                        value={item.reward_id}
                        onChange={selectItem}
                        isValid={ids.includes(item.reward_id) ? true : false}
                      />
                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </Table>
        </Row>
        <Row>
        <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
          {ids.length !== 0 ? 
          <>
            <Button style={{ backgroundColor:"red"}} onClick={removeItems}>Delete</Button>
          </> : 
          <>
            <Button style={{ backgroundColor:"green"}} onClick={(e) => {handleShow("Add")}}>Add</Button>
          </>
          }
          </Col>
        </Row>
    </Container>

    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>{modalAction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="rewards_name">
            <Form.Label>Rewards Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Reward Name" size="sm" name="rewards_name" value={newBatchData.rewards_name} onChange={handleNewDataChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="rewards_category">
            <Form.Label>Rewards Category</Form.Label>
            <Form.Control as="select" placeholder="Choose Category" size="sm" name="rewards_category" value={newBatchData.rewards_category} onChange={handleNewDataChange}>
              <option value="Vouchers">Vouchers</option>
              <option value="Others">Others</option>
            </Form.Control>          
          </Form.Group>
          <Form.Group className="mb-3" controlId="rewards_cost">
            <Form.Label>Rewards Cost</Form.Label>
            <Form.Control type="text" placeholder="Enter Reward Cost" size="sm" name="rewards_cost" value={newBatchData.rewards_cost} onChange={handleNewDataChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount_available">
            <Form.Label>Amount Available</Form.Label>
            <Form.Control type="number" placeholder="Enter Amount Available" size="sm" name="amount_available" value={newBatchData.amount_available} onChange={handleNewDataChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="media">
          <Form.Control type="file" name="media" size="sm" accept=".jpg,.jpeg" 
             onChange={handleNewDataChange}/>
          </Form.Group>
          
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {addItem(modalAction)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      
    </>
  );

};
export default Rewards;