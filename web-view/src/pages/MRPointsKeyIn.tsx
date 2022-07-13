import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import {useParams} from "react-router-dom";

const API_URL = process.env.API_URL;

const MRPointsKeyIn = () => {

  interface MRPointsType {
    mrpoint_id: number;
    collector_id: number;
    collector_name: string;
    user_id: number;
    points_given: number;
    time: Date;
    event: string;
    new_points: number;
    isGame: boolean;
  }

  interface CollectorType {
    id: number;
    daerah: string;
    name: string;
    alamat: string;
    telefon: string;
    faks: string;
    pic: string;
    type: string;
    lat: number;
    long: number;
    status: string;
    category: string;
  }

  interface UserType {
    id: number;
    email: string;
    name: string;
    password: string;
    role: string;
    mr_points: number;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [userData, setUserData] = useState<UserType>({id:0, email:"", name:"", password:"", role:"", mr_points:0});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState<string>("");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  const [collectorChoice, setCollectorChoice] = useState<Array<CollectorType>>([]);
  const [collectorSelected, setCollectorSelected] = useState<CollectorType>();

  //Add new report
  const [newData, setNewData] = useState<MRPointsType>({mrpoint_id:0, collector_id:0, collector_name:"", user_id: 0, points_given: 0, time: new Date(), event:"recycle", new_points:0, isGame:false});

  let { user_id } = useParams();

  useEffect(() => {

      let target = user_id ? parseInt(user_id) : 0
      setNewData({...newData, user_id:target});

  //get user existing point
  fetch(API_URL + 'user/' + target, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setUserData(results);
        console.log(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });

      // points_given: req.body.points_given,
      // time: req.body.time,
      // event: req.body.event

  
  },[user_id])
  

  //load colelctor data
  useEffect(() => {

    fetch(API_URL + "collector", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        let temp: CollectorType[] = [];
        for (let index = 0; index < results.length; index++) {
          temp[index] = results[index];
        }
        setCollectorChoice(temp);
        setCollectorSelected(temp[0]);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });    

  }, [])

  //Input control
  const handleNewDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const name = event.target.name;
    let idToGet:number = 0;
    let nameToGet:string = "";

    switch (name) {
      case "collector_id":
        for (let index = 0; index < collectorChoice.length; index++) {
            if(val === collectorChoice[index].id.toString()){
              const element:CollectorType = collectorChoice[index];
              setCollectorSelected(element);
              nameToGet = collectorChoice[index].name;
            }
        }
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { collector_id: val, collector_name: nameToGet}); 
        });       
        break;
      case "collector_name":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { collector_name: val }); 
        });       
        break;
      case "collector_address":

        for (let index = 0; index < collectorChoice.length; index++) {
            if(val === collectorChoice[index].alamat){
              const element:CollectorType = collectorChoice[index];
              setCollectorSelected(element);
              idToGet = collectorChoice[index].id;
              nameToGet = collectorChoice[index].name;
            }
        }   
        setNewData((prevVal) => {
            return Object.assign({}, prevVal, { collector_id: idToGet, collector_name: nameToGet}); 
          }); 
        break;
      case "user_id":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { user_id: parseInt(val)}); 
        });       
        break;   
      case "points_given":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { points_given: parseInt(val)}); 
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

    console.log(newData);
  };

    //add report func
    const addItem = () => {


      if (newData.user_id !== 0 && newData.points_given !== 0 ) {

        let payload = newData;
        payload.new_points = userData.mr_points + newData.points_given;

        fetch(API_URL + 'mrpoint', {
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
                  setNewData({mrpoint_id:0, collector_id:0, collector_name:"", user_id: 0, points_given: 0, time: new Date(), event:"recycle", new_points:0,isGame:false});
                  console.log(jsonRes.message);
                  setMessage("");
                  alert("Submited");
                  window.location.reload();
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    
      }else setMessage("Content cannot be empty!");        

    }

  return (
    <>
    <Container>
        <h3>MR Points Key In</h3>
        <Row className="p-2">
            <Form >
            {collectorSelected ? 
            <>
            <Form.Group className="mb-3" controlId="collector_id">
                <Form.Label>Collector ID</Form.Label>
                <Form.Control as="select" placeholder="Choose Collector ID" size="sm" name="collector_id" value={collectorSelected.id} onChange={handleNewDataChange}>
                {collectorChoice.map((item:CollectorType, index:number) => (
                    <option key={index} value={item.id}>{item.id}</option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="collector_name">
                <Form.Label>Collector Name</Form.Label>
                <Form.Control as="select" placeholder="Choose Collector Name" size="sm" name="collector_name" value={collectorSelected.name} onChange={handleNewDataChange} readOnly>
                {collectorChoice.map((item:CollectorType, index:number) => (
                    <option key={index} value={item.name}>{item.name}</option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="collector_address">
                <Form.Label>Collector Address</Form.Label>
                <Form.Control as="select" placeholder="Choose Collector Address" size="sm" name="collector_address" value={collectorSelected.alamat} onChange={handleNewDataChange}>
                {collectorChoice.map((item:CollectorType, index:number) => (
                    <option key={index} value={item.alamat}>{item.alamat}</option>
                ))}
                </Form.Control>
            </Form.Group>
            </>
            : <></>}


            <Form.Group className="mb-3" controlId="user_id">
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" placeholder="Enter User ID" size="sm" name="user_id" value={newData.user_id} onChange={handleNewDataChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="points_given">
                <Form.Label>MR Points Given</Form.Label>
                <Form.Control type="number" placeholder="Enter Points" size="sm" name="points_given" value={newData.points_given} onChange={handleNewDataChange}/>
            </Form.Group>
            </Form>
            {message !== "" ? 
            <p style={{backgroundColor:"red", color:"#fff", padding:5}}>{message}</p>
            :<></> }
        </Row>
        <Row>
            <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
                <Button style={{ backgroundColor:"green"}} onClick={addItem}>Submit</Button>
            </Col>
        </Row>  
    </Container>
    </>
  );

};
export default MRPointsKeyIn;