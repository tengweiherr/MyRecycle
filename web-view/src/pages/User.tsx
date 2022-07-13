import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal } from "react-bootstrap";
import { API_URL } from "../API_URL";

const Users = () => {

  interface UserType {
    id: number;
    email: string;
    name: string;
    password: string;
    role: string;
    mr_points: number;
    state: string;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<UserType>>([]);
  const [error, setError] = useState(null);

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Add new user
  const [newData, setNewData] = useState<UserType>({id:0, email:"", name:"", password:"", role:"", mr_points:0, state:""});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({id:0, email:"", name:"", password:"", role:"", mr_points:0, state:""});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'user', {
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
  }, []);

  //Input inside Modal
  const handleNewDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "email":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { email: val }); 
        });       
        break;
      case "name":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { name: val }); 
        });       
        break;
      case "password":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { password: val }); 
        });       
        break;   
      case "role":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { role: val }); 
        });       
        break; 
      case "mr_points":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { mr_points: val }); 
        });       
        break;                   
      default:
        break;
    }

    console.log(newData.mr_points);
  };

    //add user func
    const adduser = (action:string) => {

      var endpoint:string = "";

      console.log(newData.mr_points);
      console.log(newData);

      if (newData.name !== "" || newData.email !== "" || newData.password !== "" || newData.role !== "" ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'signup';
            break;
          case "Update":
            endpoint = API_URL + 'user/' + newData.id;
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
                  setNewData({ id:0, email:"", name: "", password:"", role:"", mr_points:0, state:"" });
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

  const updateuser = (event:React.MouseEvent<HTMLElement>, id:number, email: string, name: string, password: string, role: string, mr_points:number, state:string) => {
    event.preventDefault();
    setNewData({ id:id, email:email, name:name, password:"", role:role, mr_points:mr_points, state:state});
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
      console.log(payload);
      fetch(API_URL + 'user/' + payload, {
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
        <h3>Users</h3>
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Password</th>
                <th>Role</th>
                <th>MR Points</th>
                <th>State</th>
                <th>Action</th>         
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:UserType, index:number) => (
                    <tr key={`user-${index}`} className={`user-${index}`}>
                      <td className="id">
                        {item.id}
                      </td>
                      <td className="email">
                        <a href="#" onClick={(e) => {
                          updateuser(e, item.id, item.email, item.name, item.password, item.role, item.mr_points, item.state)
                        }}>{item.email}</a>
                      </td>
                      <td className="name">
                        {item.name}
                      </td>
                      <td className="password">
                        {item.password}
                      </td>
                      <td className="role">
                        {item.role}
                      </td>
                      <td className="role">
                        {item.mr_points}
                      </td>
                      <td className="state">
                        {item.state}
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
          {ids.length === 0 ? 
          <>
            <Button style={{ backgroundColor:"green"}} onClick={(e) => {handleShow("Add")}}>Add New</Button>
          </>
          : 
            <Button style={{ backgroundColor:"red"}} onClick={removeItems}>Delete</Button>
          }
          </Col>
        </Row>
    </Container>

    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            {modalAction === "Update" ? (
            <Form.Control type="text" placeholder="Enter Email" size="sm" name="email" value={newData.email} onChange={handleNewDataChange} />
            ) : 
            <Form.Control type="text" placeholder="Enter Email" size="sm" name="email" value={newData.email} onChange={handleNewDataChange} />
            }
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name" size="sm" name="name" value={newData.name} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="text" placeholder="Enter Password" size="sm" name="password" value={newData.password} onChange={handleNewDataChange}/>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" placeholder="Enter Role" size="sm" name="role" value={newData.role} onChange={handleNewDataChange}>
            <option value="recycler">Recycler</option>
            <option value="collector">Collector</option>
            <option value="officer">JPSPN Officer</option>
            <option value="head">JPSPN Head of Officer</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="mr_points">
            <Form.Label>MR Points</Form.Label>
            <Form.Control type="number" placeholder="Enter MR Points" size="sm" name="mr_points" value={newData.mr_points} onChange={handleNewDataChange}/>
          </Form.Group>

        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {adduser(modalAction)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};
export default Users;