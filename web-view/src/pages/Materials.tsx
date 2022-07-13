import React, { useState, useEffect } from "react";
import { Button, Container, Row, Table, Col, Form, Modal } from "react-bootstrap";
import { API_URL } from "../API_URL";

const Materials = () => {

  interface MaterialType {
    id: number;
    material: string;
    time: string;
    guide: string;
    category: string,
    recyclable: Array<string>,
    non_recyclable: Array<string>,
    conversion_rate: number,
    recyclable_media: Array<string>,
    non_recyclable_media: Array<string>
  }

  interface ItemsMediaType {
    item?: string;
    media?: string;
  }

  interface MediaType {
    preview?: string;
    data?: string;
  }

  const [recyclableImage, setRecyclableImage] = useState<Array<MediaType|any>>([]);
  const [nonRecyclableImage, setNonRecyclableImage] = useState<Array<MediaType|any>>([]);

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState<Array<MaterialType>>([]);

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //Add new user
  const [newData, setNewData] = useState<MaterialType>({id:0, material:"", time:"", guide:"", category:"", recyclable:[], non_recyclable:[], conversion_rate:0, recyclable_media:[], non_recyclable_media:[]});

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({id:0, material:"", time:"", guide:"", category:"", recyclable:[], non_recyclable:[], conversion_rate:0, recyclable_media:[], non_recyclable_media:[]});
    }
    setShow(true);
  }

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'material', {
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
      case "material":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { material: val }); 
        });       
        break;
      case "time":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { time: val }); 
        });       
        break;
      case "guide":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { guide: val }); 
        });       
        break;      
      case "category":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { category: val }); 
        });       
        break;  
      default:
        break;
    }
  };

    //add user func
    const addMaterial = (action:string) => {

      var endpoint:string = "";

      if (newData.material !== "" || newData.time !== "" || newData.guide !== "" || newData.category !== "" ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'material';
            break;
          case "Update":
            endpoint = API_URL + 'material/' + newData.id;
            break;
          default:
            break;
        }

        let formdata = new FormData();
        formdata.append("id", newData.id.toString())
        formdata.append("material", newData.material)
        formdata.append("time", newData.time)
        formdata.append("guide", newData.guide)
        formdata.append("category", newData.category)
        formdata.append("conversion_rate", newData.conversion_rate.toString())
        formdata.append("recyclable", newData.recyclable.toString())
        formdata.append("non_recyclable", newData.non_recyclable.toString())
        formdata.append("recyclable_media", newData.recyclable_media.toString())
        formdata.append("non_recyclable_media", newData.non_recyclable_media.toString())

        for (let index = 0 ; index < recyclableImage.length ; index++) {
          let file = new File([recyclableImage[index].data], newData.recyclable_media[index], {type: 'image/jpg'});
          formdata.append("media", file);
        }

        for (let index = 0 ; index < nonRecyclableImage.length ; index++) {
          let file = new File([nonRecyclableImage[index].data], newData.non_recyclable_media[index], {type: 'image/jpg'});
          formdata.append("media", file);
        }

       // Display the values
        for (var value of formdata.values()) {
          console.log(value);
        }

        fetch(endpoint, {
          method: 'POST',
          // headers: {
          //     'Content-Type': 'multipart/form-data',
          // },
          body: formdata,
          })
          .then(response => response.json())
          .then(results => {
              setNewData({ id:0, material:"", time: "", guide:"", category:"", recyclable:[], non_recyclable:[], conversion_rate:0, recyclable_media:[], non_recyclable_media:[]});
              window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
    
      };        

    }

  const updateMaterial = (event:React.MouseEvent<HTMLElement>, item:MaterialType) => {
    event.preventDefault();
    setNewData({ id:item.id, material:item.material, time:item.time, guide:item.guide, category:item.category, recyclable:item.recyclable, non_recyclable:item.non_recyclable, conversion_rate:item.conversion_rate, recyclable_media:item.recyclable_media, non_recyclable_media:item.non_recyclable_media});
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
      fetch(API_URL + 'material/' + payload, {
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

const _renderRecyclableItemsAndMedia = (data:MaterialType) => (

  data.recyclable.map((item, index) => {
    return (
        <tr>
          <td>
            <Form.Control type="text" placeholder={`Item-${index}`} size="sm" name="recyclable" key={index} value={item? item : undefined} 
            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                let temp = newData.recyclable;
                temp[index] = event.target.value;
                setNewData((prevVal) => {
                  return Object.assign({}, prevVal, { recyclable: temp }); 
                });  
            }}/> 
          </td>
          <td>
            {data.recyclable_media[index] &&
            <>
            <div className="d-flex flex-column justify-content-start">
                <img src={recyclableImage[index] ? recyclableImage[index].preview : API_URL + "static/materials/" + data.recyclable_media[index]} style={{height:150, width:"auto",objectFit:"cover", margin:"2px"}}/>
                <p>{data.recyclable_media[index]}</p>
            </div>
            </>
            }
            <Form.Control type="file" name="recyclable_media" size="sm" accept=".jpg,.jpeg" 
              onChange={(event:React.ChangeEvent<HTMLInputElement>|any)=>{
                if (event.target.files[0].length !== 0){

                  let temp1 = recyclableImage;
                  const img:MediaType = {
                    preview: URL.createObjectURL(event.target.files[0]),
                    data: event.target.files[0],
                  }
                  temp1[index] = img;
                  setRecyclableImage(temp1);

                      
                  let temp = newData.recyclable_media;
                  temp[index] = event.target.files[0].name.split(".")[0] + "-" + Date.now() + "." + event.target.files[0].name.split(".")[1];

                  setTimeout(function(){
                    setNewData((prevVal) => ({...prevVal, recyclable_media:temp}));
                  },1000);
                
                }
              }}/>
          
          </td>
      </tr>
    )
  })
)

const _renderNonRecyclableItemsAndMedia = (data:MaterialType) => (

  data.non_recyclable.map((item, index) => {
    return (
        <tr>
          <td>
            <Form.Control type="text" placeholder={`Item-${index}`} size="sm" name="recyclable" key={index} value={item? item : undefined} 
            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                let temp = newData.non_recyclable;
                temp[index] = event.target.value;
                setNewData((prevVal) => {
                  return Object.assign({}, prevVal, { non_recyclable: temp }); 
                });  
            }}/> 
          </td>
          <td>
            {data.non_recyclable_media[index] &&
            <>
            <div className="d-flex flex-column justify-content-start">
                <img src={nonRecyclableImage[index] ? nonRecyclableImage[index].preview : API_URL + "static/materials/" + data.non_recyclable_media[index]} style={{height:150, width:"auto",objectFit:"cover", margin:"2px"}}/>
                <p>{data.non_recyclable_media[index]}</p>
            </div>
            </>
            }
            <Form.Control type="file" name="recyclable_media" size="sm" accept=".jpg,.jpeg" 
              onChange={(event:React.ChangeEvent<HTMLInputElement>|any)=>{
                if (event.target.files[0].length !== 0){

                  let temp1 = nonRecyclableImage;
                  const img:MediaType = {
                    preview: URL.createObjectURL(event.target.files[0]),
                    data: event.target.files[0],
                  }
                  temp1[index] = img;
                  setNonRecyclableImage(temp1);

                  let temp = newData.non_recyclable_media;
                  temp[index] = event.target.files[0].name.split(".")[0] + "-" + Date.now() + "." + event.target.files[0].name.split(".")[1];

                  setTimeout(function(){
                    setNewData((prevVal) => ({...prevVal, non_recyclable_media:temp}));
                  },1000);
                
                }
              }}/>
          
          </td>
      </tr>
    )
  })
)

  return (
    <>
    <Container>
        <h3>Materials</h3>
        <Row className="p-2">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Material</th>
                <th>Biodegradable Time</th>
                <th>Recycle Guide</th>
                <th>Recyclable</th>
                <th>Non-recyclable</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {
                  data.map((item:MaterialType, index:number) => (
                    <tr key={`user-${index}`} className={`user-${index}`}>
                      <td className="id">
                        {item.id}
                      </td>
                      <td className="category">
                        {item.category}
                      </td>
                      <td className="material">
                        <a href="#" onClick={(e) => {
                          updateMaterial(e, item)
                        }}>{item.material}</a>
                      </td>
                      <td className="time">
                        {item.time}
                      </td>
                      <td className="guide">
                        {item.guide}
                      </td>
                      <td className="recyclable">
                        {item.recyclable}
                      </td>
                      <td className="non_recyclable">
                        {item.non_recyclable}
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
          <Modal.Title>{modalAction} material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" placeholder="Enter Category" size="sm" name="category" value={newData.category} onChange={handleNewDataChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="material">
            <Form.Label>Material</Form.Label>
            <Form.Control type="text" placeholder="Enter Material" size="sm" name="material" value={newData.material} onChange={handleNewDataChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="time">
            <Form.Label>Biodegradable Time</Form.Label>
            <Form.Control type="text" placeholder="Enter Time" size="sm" name="time" value={newData.time} onChange={handleNewDataChange}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="guide">
            <Form.Label>Recycle Guide</Form.Label>
            <Form.Control type="text" placeholder="Enter Guide" size="sm" name="guide" value={newData.guide} onChange={handleNewDataChange}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="recyclable">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Recyclable Items</th>
                    <th>Media</th>
                  </tr>
                </thead>
              <tbody>
                {newData && _renderRecyclableItemsAndMedia(newData)}
              </tbody>
              </Table>
          </Form.Group>
          <Form.Group className="mb-3" controlId="recyclable">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Non-Recyclable Items</th>
                    <th>Media</th>
                  </tr>
                </thead>
              <tbody>
                {newData && _renderNonRecyclableItemsAndMedia(newData)}
              </tbody>
              </Table>
          </Form.Group>
          {/* <Form.Group className="mb-3" controlId="non_recyclable">
            <Form.Label>Non-Recyclable Items</Form.Label>
            <Form.Control type="text" placeholder="Enter Non-Recyclable Items" size="sm" name="non_recyclable" value={newData.non_recyclable} onChange={handleNewDataChange}/>
          </Form.Group> */}
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {addMaterial(modalAction)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};
export default Materials;