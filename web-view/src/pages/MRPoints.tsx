import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { API_URL } from "../API_URL";

const MRPoints = () => {

  interface MRPointsType {
    mrpoint_id: number;
    collector_id: number;
    collector_name: string;
    user_id: number;
    points_given: number;
    time: Date;
    event: string;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<MRPointsType>>([]);
  const [error, setError] = useState(null);

  // Current category
  const [status, setStatus] = useState("All");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Add new report
  const [newData, setNewData] = useState<MRPointsType>({mrpoint_id:0, collector_id:0, collector_name:"", user_id: 0, points_given: 0, time: new Date(), event:""});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({mrpoint_id:0, collector_id:0, collector_name:"", user_id: 0, points_given: 0, time: new Date(), event:""});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'mrpoint/', {
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

  //Input inside Modal
  const handleNewDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "collector_id":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { collector_id: val }); 
        });       
        break;
      case "collector_name":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { collector_name: val }); 
        });       
        break;
      case "user_id":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { user_id: val }); 
        });       
        break;   
      case "points_given":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { points_given: val }); 
        });       
        break;
      case "time":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { time: val }); 
        });       
        break;  
      case "event":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { event: val }); 
        });       
        break;                     
      default:
        break;
    }
  };

    //add report func
    const addItem = (action:string) => {

      var endpoint:string = "";

      if (newData.user_id !== 0 || newData.event !== "" || !newData.time ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'mrpoint';
            break;
          case "Update":
            endpoint = API_URL + 'mrpoint/' + newData.mrpoint_id;
            break;
          default:
            break;
        }

        const payload = newData;

        fetch(endpoint, {
            method: 'POST',
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
                  setNewData({mrpoint_id:0, collector_id:0, collector_name:"", user_id: 0, points_given: 0, time: new Date(), event:""});
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

  const updateItem = (event:React.MouseEvent<HTMLElement>, mrpoint_id:number, collector_id:number, collector_name:string, user_id:number, points_given:number, time:Date, eventString:string) => {
    event.preventDefault();
    setNewData({ mrpoint_id:mrpoint_id, collector_id:collector_id, collector_name:collector_name, user_id:user_id, points_given:points_given, time:new Date(), event:eventString});
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
      fetch(API_URL + 'mrpoint/' + payload, {
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

        // const verify = () => {

        //   const payload = ids;
        //   fetch(API_URL + 'report/verify/' + payload, {
        //       method: 'POST',
        //       headers: {
        //           'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify(payload),
        //     })
        //     .then(async res => { 
        //       try {
        //           const jsonRes = await res.json();
        //           if (res.status !== 200) {
        //               console.log(jsonRes.message);
        //           } else {
        //             console.log(jsonRes.message);
        //             window.location.reload();
        //           }
        //       } catch (err) {
        //           console.log(err);
        //       };
        //   })
        //   .catch(err => {
        //       console.log(err);
        //   });
          
        // };

  return (
    <>
    <Container>
        <h3>MR Points</h3>
        <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "all" ? "button pending active" : "button"} onClick={()=>setStatus("all")} >All</Button>
            <Button className={status == "recycle" ? "button waiting active" : "button"} onClick={()=>setStatus("recycle")}>Recycle</Button>
            <Button className={status == "game" ? "button inprogress active" : "button"} onClick={()=>setStatus("game")}>Game</Button>
            <Button className={status == "redeem" ? "button solved active" : "button"} onClick={()=>setStatus("redeem")}>Redeem Reward</Button>
        </Col>
        </Row>
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Event</th>
                <th>Time</th>
                <th>Points Get/Loss</th> 
                <th>Action</th>    
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:MRPointsType, index:number) => (
                    <tr key={`mrpoints-${index}`} className={`mrpoints-${index}`}>
                      <td className="user_id">
                      <a href="#" onClick={(e) => {
                          updateItem(e, item.mrpoint_id, item.collector_id, item.collector_name, item.user_id, item.points_given, item.time, item.event)
                        }}>{item.user_id}</a> 
                      </td>
                      <td className="event">
                        {item.event}
                      </td>
                      <td className="time">
                        {item.time}
                      </td>
                      <td className="points">
                        {item.points_given}
                      </td>
                      <td className="action">
                        
                      <Form.Check
                        type="checkbox"
                        value={item.mrpoint_id}
                        onChange={selectItem}
                        isValid={ids.includes(item.mrpoint_id) ? true : false}
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
          </> : <></>
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
          <Form.Group className="mb-3" controlId="event">
            <Form.Label>Event</Form.Label>
            {modalAction === "Update" ? (
            <Form.Control type="text" placeholder="Enter Event" size="sm" name="event" value={newData.event} onChange={handleNewDataChange} />
            ) : 
            <Form.Control type="text" placeholder="Enter Event" size="sm" name="event" value={newData.event} onChange={handleNewDataChange} />
            }
          </Form.Group>
          <Form.Group className="mb-3" controlId="user_id">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="text" placeholder="Enter User ID" size="sm" name="user_id" value={newData.user_id} onChange={handleNewDataChange}/>
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="time">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" placeholder="Enter Date Time" size="sm" name="time" value={newData.time} onChange={handleNewDataChange}/>
          </Form.Group> */}
          
          {/* <Form.Group className="mb-3" controlId="points_given">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" placeholder="Enter Points" size="sm" name="category" value={newData.category} onChange={handleNewDataChange}>
            <option>Environment</option>
            <option>Facilities</option>
            <option>Others</option>
            </Form.Control>
          </Form.Group> */}

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
export default MRPoints;