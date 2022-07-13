import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { API_URL } from "../API_URL";

const Game = () => {

  interface GameType {
    id: number,
    question: string,
    options: Array<string>,
    answer: number,
    point: number,
    tips: string|null,
    origin: string|null,
    level: number,
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<GameType>>([]);
  const [error, setError] = useState(null);

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Add new report
  const [newData, setNewData] = useState<GameType>({id:0, question:"", options:["","",""],answer:0,point:0,tips:null,origin:null,level:0});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({id:0, question:"", options:["","",""],answer:0,point:0,tips:null,origin:null,level:0});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'game/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
        console.log(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });

  }, []);

  //Input inside Modal
  const handleNewDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "question":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { question: val }); 
        });       
        break;      
      case "options":
        console.log(typeof(val));
        break;  
      case "answer":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { answer: parseInt(val) }); 
        });       
        break;  
      case "point":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { point: parseInt(val) }); 
        });       
        break;  
      case "tips":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { tips: val }); 
        });       
        break;  
      case "origin":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { origin: val }); 
        });       
        break;     
      case "level":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { level: parseInt(val) }); 
        });       
        break;            
      default:
        break;
    }
  };

    //add report func
    const addItem = (action:string) => {

      var endpoint:string = "";

      if (newData.question !== "" || newData.options.length !==0 ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'game';
            break;
          case "Update":
            endpoint = API_URL + 'game/' + newData.id;
            break;
          default:
            break;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          })
          .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log(jsonRes.message);
                } else {
                  setNewData({id:0, question:"", options:["","",""],answer:0,point:0,tips:null,origin:null,level:0});
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

  const updateItem = (event:React.MouseEvent<HTMLElement>, item:GameType ) => {
    event.preventDefault();
    setNewData(item);
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
      fetch(API_URL + 'game/' + payload, {
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
        <h3>Games</h3>
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Options</th>
                <th>Answer</th>
                <th>Point</th>
                <th>Tips</th>
                <th>Origin</th>
                <th>Level</th>
                <th>Action</th>    
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:GameType, index:number) => (
                    <tr key={`Game-${index}`} className={`Game-${index}`}>
                      <td className="id">
                        {item.id} 
                      </td>
                      <td className="question">
                        <a href="#" onClick={(e) => {
                          updateItem(e, item)
                        }}>
                        {item.question}
                          </a>
                      </td>
                      <td className="options">
                        {item.options}
                      </td>
                      <td className="answer">
                        {item.answer}
                      </td>
                      <td className="point">
                        {item.point}
                      </td>
                      <td className="tips">
                        {item.tips}
                      </td>
                      <td className="origin">
                        {item.origin}
                      </td>
                      <td className="level">
                        {item.level}
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
        <Form>
          <Form.Group className="mb-3" controlId="game_form">
            <Form.Label>Question</Form.Label>
            <Form.Control type="text" placeholder="Enter Question" size="sm" name="question" value={newData.question} onChange={handleNewDataChange}/>
            <Form.Label>Options</Form.Label>
            {newData.options.map((option:string, index:number)=>(
              <Form.Control type="text" placeholder="Enter Option" size="sm" name="option" value={option} 
              onChange={(e)=>{
                if(e.target.value)
                {
                  let temp = newData.options;
                  temp[index] = e.target.value;
                  setNewData((prevVal) => {
                    return Object.assign({}, prevVal, { options: temp }); 
                  });  
                  console.log(newData);
                }
              }}/>
            ))}
            <Form.Label>Answer</Form.Label>
            <Form.Control type="number" placeholder="Enter Answer" size="sm" name="answer" min="0" max="2" value={newData.answer} onChange={handleNewDataChange}/>
            <Form.Label>Point</Form.Label>
            <Form.Control type="number" placeholder="Enter Point" size="sm" name="point" min="0" value={newData.point} onChange={handleNewDataChange}/>
            <Form.Label>Tips</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Enter Tips" size="sm" name="tips" value={newData.tips?newData.tips:undefined} onChange={handleNewDataChange}/>
            <Form.Label>Origin</Form.Label>
            <Form.Control type="text" placeholder="Enter Origin" size="sm" name="origin" value={newData.origin?newData.origin:undefined} onChange={handleNewDataChange}/>
            <Form.Label>Level</Form.Label>
            <Form.Control type="number" placeholder="Enter Level" size="sm" name="level" min="0" value={newData.level} onChange={handleNewDataChange}/>
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
export default Game;