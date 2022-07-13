import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup } from "react-bootstrap";

const Guide = () => {

  const API_URL = process.env.REACT_APP_API_URL;

  interface GuideType {
    id: number;
    content: string;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<GuideType>>([]);
  const [error, setError] = useState(null);

  // Current category
  const [status, setStatus] = useState("All");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Add new report
  const [newData, setNewData] = useState<GuideType>({id:0, content:""});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({id:0, content:""});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'guide/', {
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
      case "id":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { id: val }); 
        });       
        break;
      case "content":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { content: val }); 
        });       
        break;                   
      default:
        break;
    }
  };

    //add report func
    const addItem = (action:string) => {

      var endpoint:string = "";

      if (newData.id !== 0 || newData.content !== "" ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'guide';
            break;
          case "Update":
            endpoint = API_URL + 'guide/' + newData.id;
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
                  setNewData({id:0, content:""});
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

  const updateItem = (event:React.MouseEvent<HTMLElement>, id:number, content:string) => {
    event.preventDefault();
    setNewData({ id:id, content:content});
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
      fetch(API_URL + 'guide/' + payload, {
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
        <h3>Guides</h3>
        {/* <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "all" ? "button pending active" : "button"} onClick={()=>setStatus("all")} >All</Button>
            <Button className={status == "recycle" ? "button waiting active" : "button"} onClick={()=>setStatus("recycle")}>Recycle</Button>
            <Button className={status == "game" ? "button inprogress active" : "button"} onClick={()=>setStatus("game")}>Game</Button>
            <Button className={status == "redeem" ? "button solved active" : "button"} onClick={()=>setStatus("redeem")}>Redeem Reward</Button>
        </Col>
        </Row> */}
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Action</th>    
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:GuideType, index:number) => (
                    <tr key={`Guide-${index}`} className={`Guide-${index}`}>
                      <td className="id">
                      <a href="#">{item.id}</a> 
                      </td>
                      <td className="content">
                        <a href="#" onClick={(e) => {
                          updateItem(e, item.id, item.content)
                        }}>
                        {item.content}
                          </a>
                      </td>
                      <td className="action">
                        
                      <Form.Check
                        type="checkbox"
                        value={item.id}
                        onChange={selectItem}
                        isValid={ids.includes(item.id) ? true : false}
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
            <Button style={{ backgroundColor:"green"}} onClick={(e) => {handleShow("Add")}}>Add New</Button>
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
          <Form.Group className="mb-3" controlId="id">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" placeholder="Enter ID" size="sm" name="id" value={newData.id} readOnly />
          </Form.Group>
          <Form.Group className="mb-3" controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control type="text" placeholder="Enter Content" size="sm" name="content" value={newData.content} onChange={handleNewDataChange}/>
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
export default Guide;