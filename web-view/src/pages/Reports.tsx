import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, DropdownButton, ButtonToolbar, ButtonGroup, Image } from "react-bootstrap";
import "./Reports.scss";
import { API_URL } from "../API_URL";

const Reports = () => {

  interface ReporterType {
    id: number;
    title: string;
    description: string;
    date: string;
    category: string;
    location: string;
    status: string;
    verified_comment: string;
    verified_time: Date;
    media: string|null;
    userId: string
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<ReporterType>>([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState<string>("");

  //comment
  const [comment, setComment] = useState<string>("");

  // Current category
  const [status, setStatus] = useState("Pending");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //search
  const [search, setSearch] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Array<ReporterType>>([]);
  const [searchFilter, setSearchFilter] = useState("id");

  //Add new report
  const [newData, setNewData] = useState<ReporterType>({id:0, title:"", description: "", date: "", category:"", location:"", status:"", verified_comment:"", verified_time: new Date() ,media:"", userId:""});

  const [userrole, setUserrole] = useState("");

  // User is currently on this page
  const [currentPage, setCurrentPage] = useState(1);
  // No of Records to be displayed on each page   
  const [recordsPerPage] = useState(20);

  const indexOfLastRecord = useRef(currentPage * recordsPerPage);
  const indexOfFirstRecord = useRef(indexOfLastRecord.current - recordsPerPage);

  // Records to be displayed on the current page
  const [currentRecords,setCurrentRecords] = useState(data.slice(indexOfFirstRecord.current, indexOfLastRecord.current));
  // const currentRecords = useRef(data.slice(indexOfFirstRecord.current, indexOfLastRecord.current));

  const nPages = useRef(Math.ceil(data.length / recordsPerPage));

  useEffect(() => {
      
    indexOfLastRecord.current = currentPage * recordsPerPage;
    indexOfFirstRecord.current = indexOfLastRecord.current - recordsPerPage;
    setCurrentRecords(filteredData.slice(indexOfFirstRecord.current,indexOfLastRecord.current));
    nPages.current = Math.ceil(filteredData.length / recordsPerPage);
    // setFilteredData(currentRecords.current);

  }, [currentPage,filteredData])

  const nextPage = () => {
    if(currentPage !== nPages.current) 
        setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
      if(currentPage !== 1) 
          setCurrentPage(currentPage - 1)
  }

  const Pagination = () => {
    const pageNumbers = [...Array(nPages.current + 1).keys()].slice(1)

    return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a className="page-link" onClick={prevPage} href="#">
            Previous
          </a>
        </li>
        {pageNumbers.map(pgNumber=>(
          <li key={pgNumber} className={`page-item ${currentPage===pgNumber?"active":""}`}>
              <a onClick={()=>setCurrentPage(pgNumber)} className="page-link" href="#">
                {pgNumber}
              </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" onClick={nextPage} href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
    );

  }

  //get user role
  const getRole = async () => {
    try {
      const value = await localStorage.getItem('userRole');
      if (value !== null) {
        // We have data!!
        setUserrole(value);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

    useEffect(() => {
      getRole();
    }, []);

  //Add Modal
  const [addShow, setAddShow] = useState(false);
  const [addModalAction, setAddModalAction] = useState("");
  const handleAddClose = () => setAddShow(false);
  const handleAddShow = (action:string) => {
    setAddModalAction(action);
    if (action === "Add") {
      setNewData({id:0, title:"", description: "", date: "", category:"", location:"", status:"Pending", verified_comment:"", verified_time: new Date(), media:"", userId:""});
    }
    setAddShow(true);
  }

  //Comment Modal
  const [commentShow, setCommentShow] = useState(false);
  const [commentModalAction, setCommentModalAction] = useState("");
  const handleCommentClose = () => setCommentShow(false);
  const handleCommentShow = (action:string) => {
    setCommentModalAction(action);
      // setNewData({id:0, title:"", description: "", date: "", category:"", location:"", status:"Pending", verified_comment:"", verified_time: new Date(), media:"", userId:""});
    setCommentShow(true);
  }

  //load report data
  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'report/status/' + status, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
        setFilteredData(results);
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
      case "title":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { title: val }); 
        });       
        break;
      case "description":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { description: val }); 
        });       
        break;
      case "date":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { date: val }); 
        });       
        break;   
      case "category":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { category: val }); 
        });       
        break;
      case "location":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { location: val }); 
        });       
        break;  
      case "status":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { status: val }); 
        });       
        break;  
      case "verified_comment":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { verified_comment: val }); 
        });       
        break; 
      case "media":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { media: val }); 
        });       
        break;                    
      default:
        break;
    }
  };

  //Input inside Comment Modal
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setComment(val);
  };

    //add report func
    const addreport = (action:string) => {

      var endpoint:string = "";

      if (newData.title !== "" || newData.description !== "" || !newData.date || newData.location !== "" || newData.category !== "" ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'report';
            break;
          case "Update":
            endpoint = API_URL + 'report/' + newData.id;
            break;
          default:
            break;
        }
        setNewData({...newData,status:"Pending"});
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
                    setMessage("Content cannot be empty!");
                } else {
                  setNewData({id:0, title:"", description: "", date: "", category:"", location:"", status:"Pending", verified_comment:"", verified_time: new Date(), media:"", userId:""});
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
    
      } else setMessage("Content cannot be empty!");       

    }

  const updatereport = (event:React.MouseEvent<HTMLElement>, id:number, title: string, description: string, date: string, category: string, location: string, status: string, verified_comment: string, media: string|null, userId:string) => {
    event.preventDefault();
    setNewData({ id:id, title:title, description:description, date:date, category:category, location:location, status:status, verified_comment:verified_comment, verified_time: new Date(), media:media, userId:userId});
    handleAddShow("Update");
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
      fetch(API_URL + 'report/' + payload, {
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

    const handleSearchFilter = (event:React.ChangeEvent<HTMLInputElement>) => {
      // Check if searched text is not blank
      if (event) {
        const text = event.target.value;
        setSearchFilter(text);
      } 
    };

    const searchFilterFunction = (event:React.ChangeEvent<HTMLInputElement>) => {
      // Check if searched text is not blank
      if (event) {
        const text = event.target.value;

        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredData
        const tempData:Array<ReporterType> = data.filter(
          function (item) {
            
            let itemData = "";

            switch (searchFilter) {
              case "id":
                itemData = item.id.toString();
                break;
              case "title":
                itemData = item.title
                ? item.title.toUpperCase()
                : ''.toUpperCase();
                break;
              default:
                break;
            }

            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredData(tempData);
        setCurrentPage(1);
        // setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredData with masterDataSource
        setFilteredData(data);
        // setSearch(text);
      }
    };

  const updateStatus = (status:string) => {

    let payload = {};
    switch (status) {
      case "Verified":
        payload = {status:status, verified_comment:comment, verified_time:new Date()}
        break;
      case "In Progress":
        payload = {status:status, in_progress_comment:comment, in_progress_time:new Date()}
        break;
      case "Solved":
        payload = {status:status, solved_comment:comment, solved_time:new Date()}
        break;
      case "Rejected":
        payload = {status:status, rejected_comment:comment, rejected_time:new Date()}
        break;
      default:
        break;
    }


  fetch(API_URL + 'report/status/' + ids, {
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
              setComment("");
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
  
}

  return (
    <>
    <Container>
        <h3>Reports</h3>
        <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "Pending" ? "button active" : "button"} onClick={()=>setStatus("Pending")} >Pending</Button>
            <Button className={status == "Verified" ? "button active" : "button"} onClick={()=>setStatus("Verified")}>Verified</Button>
            <Button className={status == "In Progress" ? "button active" : "button"} onClick={()=>setStatus("In Progress")}>In Progress</Button>
            <Button className={status == "Solved" ? "button active" : "button"} onClick={()=>setStatus("Solved")}>Solved</Button>
            <Button className={status == "Rejected" ? "button active" : "button"} onClick={()=>setStatus("Rejected")}>Rejected</Button>
        </Col>
        </Row>
        <Row className="py-2">
          <Col sm={7}>
            <Form.Group controlId="search">
              <Form.Control className="py-2" type="text" placeholder="Search" size="sm" name="search" onChange={searchFilterFunction}/>
            </Form.Group>
          </Col>
          <Col sm={2} style={{marginLeft:-30}}>
          <Form.Group controlId="searchFilter">
            <Form.Control className="p-2" as="select" placeholder="Search Filter" size="sm" name="searchFilter" value={searchFilter} onChange={handleSearchFilter}>
              <option value="id">By ID</option>
              <option value="title">By Title</option>
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
        <Row className="p-2">
        {Pagination()}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Date</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                {/* <th>Media</th>         */}
                <th>Action</th>          
              </tr>
            </thead>
            <tbody>
                {
                  currentRecords.map((item:ReporterType, index:number) => (
                    <tr key={`report-${index}`} className={`report-${index}`}>
                      <td>
                        {item.id}
                      </td>
                      <td className="title">
                        <a href="#" onClick={(e) => {
                            updatereport(e, item.id, item.title, item.description, item.date, item.category, item.location, item.status, item.verified_comment, item.media, item.userId)
                          }}>{item.title}</a> 
                      </td>
                      
                      {/* <td>{item.title}</td>  */}
                      
                      <td className="userId">
                        {item.userId}
                      </td>
                      <td className="date">
                        {item.date.split('T')[0]}
                      </td>
                      <td className="category">
                        {item.category}
                      </td>
                      <td className="location">
                        {item.location}
                      </td>
                      <td className="status">
                        {item.status}
                      </td>
                      {/* <td className="media">
                        {item.media}
                      </td> */}
                      <td className="action">
                      {userrole === "admin" || (userrole === "officer" && item.status === "Pending") || (userrole === "head" && item.status === "Verified" ) || (userrole === "head" && item.status === "In Progress" )? 
                      <Form.Check
                      type="checkbox"
                      value={item.id}
                      onChange={selectItem}
                      isValid={ids.includes(item.id) ? true : false}
                      />
                      : <></>}
                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </Table>
        </Row>
        {userrole === "admin" ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
          {ids.length !== 0 ? 
            <Button style={{ backgroundColor:"red"}} onClick={removeItems}>Delete</Button> : <></>}
          </Col>
        </Row> : <></>}

        {userrole === "officer" && ids.length !== 0 ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
            <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>handleCommentShow("Rejected")}>Rejected</Button>
            <Button style={{ backgroundColor:"green"}} onClick={(e)=>handleCommentShow("Verified")}>Verify</Button>
          </Col>
        </Row>    
        : <></>}

        {userrole === "head" ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
            {status === "Verified" ? 
            <>
              <Button style={{ backgroundColor:"orange", marginRight:"10px"}} onClick={(e)=>handleCommentShow("In Progress")}>In Progress</Button>
              <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>handleCommentShow("Rejected")}>Rejected</Button>
            </>
            :<></>}
            {status === "In Progress" ? 
            <>
              <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>handleCommentShow("Rejected")}>Rejected</Button>
              <Button style={{ backgroundColor:"green"}} onClick={(e)=>handleCommentShow("Solved")}>Solved</Button>
            </>
            :<></>}
          </Col>
        </Row>    
        : <></>}

    </Container>

    <Modal show={addShow} aria-labelledby="contained-modal-title-vcenter" onHide={handleAddClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>{addModalAction} report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column">
        <Form >
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Report Title</Form.Label>
            {addModalAction === "Update" ? (
            <Form.Control type="text" placeholder="Enter Report Title" size="sm" name="title" value={newData.title} onChange={handleNewDataChange} />
            ) : 
            <Form.Control type="text" placeholder="Enter Report Title" size="sm" name="title" value={newData.title} onChange={handleNewDataChange} />
            }
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" rows={3} placeholder="Enter State" size="sm" name="description" value={newData.description} onChange={handleNewDataChange}/>
          </Form.Group>

          {newData.media &&
          <div className="d-flex flex-horizontal justify-content-start">
            {newData.media.split(",").map((image,index)=>(
              <Image key={'report-image-' + index} src={API_URL + "static/reports/" + image} style={{height:150, width:"auto", margin:"0 2px"}}/>
            ))}
          </div>
          }
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" placeholder="Enter Date" size="sm" name="date" value={newData.date} onChange={handleNewDataChange}/>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" placeholder="Enter Category" size="sm" name="category" value={newData.category} onChange={handleNewDataChange}>
            <option>Environment</option>
            <option>Facilities</option>
            <option>Others</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Enter Location" size="sm" name="location" value={newData.location} onChange={handleNewDataChange}/>
          </Form.Group>

          {newData.status === "Verified" &&           
          <Form.Group className="mb-3" controlId="verified_comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control type="text" as="textarea" rows={3} placeholder="Enter Comment" size="sm" name="verified_comment" value={newData.verified_comment} onChange={handleNewDataChange}/>
          </Form.Group>}

          {/* <Form.Group className="mb-3" controlId="media">
            <Form.Label>Media</Form.Label>
            <Form.Control type="text" placeholder="Enter Media" size="sm" name="media" value={newData.media} onChange={handleNewDataChange}/>
          </Form.Group> */}

        </Form>
        {message !== "" && 
        <p style={{backgroundColor:"red", color:"#fff", padding:5}}>{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => {addreport(addModalAction)}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={commentShow} aria-labelledby="contained-modal-title-vcenter" onHide={handleCommentClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="comment">
            <Form.Control type="text" placeholder="Enter Comment or leave it as blank" size="sm" name="comment" value={comment} onChange={handleCommentChange}/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCommentClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e)=>updateStatus(commentModalAction)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      
    </>
  );

};
export default Reports;