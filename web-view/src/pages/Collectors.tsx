import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Button, Container, Row, Table, Col, Form, Modal } from "react-bootstrap";
import { ArrowRight, Trash } from 'react-bootstrap-icons';

const Collectors = () => {

  const API_URL = process.env.REACT_APP_API_URL;

  interface CollectorType {
    id: number;
    daerah: string;
    name: string;
    alamat: string;
    telefon: string|null;
    faks: string|null;
    pic: string|null;
    type: string|null;
    lat: number;
    long: number;
    status: string;
    category: string;
  }

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [data, setData] = useState<Array<CollectorType>>([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState<String>("");
  const [status, setStatus] = useState<String>("");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //scrap data
  const [scrapedData, setScrapedData] = useState<any>([]);
  const [targetPDF, setTargetPDF] = useState<any>(null);
  const [index, setIndex] = useState<number>(0);
  const [scrapedCategory, setScrapedCategory] = useState<string>("General Waste");

  //search
  const [search, setSearch] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Array<CollectorType>>([]);
  const [searchFilter, setSearchFilter] = useState("name");

  //Add new collector
  const [newData, setNewData] = useState<CollectorType>({id:0, daerah:"", name: "", alamat:"", telefon:null, faks:null, pic:null, type:null, lat:0, long:0, status:"Pending", category:"General Waste"});

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

  //Modal
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const handleClose = () => {
    setShow(false);
    setMessage("")
  };
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({id:0, daerah:"", name: "", alamat:"", telefon:null, faks:null, pic:null, type:null, lat:0, long:0, status:"Pending", category:""});
    }
    setShow(true);
  }

  //scrap modal
  const [scrapShow, setScrapShow] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'collector/' + status, {
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
      case "daerah":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { daerah: val }); 
        });       
        break;
      case "name":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { name: val }); 
        });       
        break;
      case "alamat":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { alamat: val }); 
        });       
        break;   
      case "telefon":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { telefon: val }); 
        });       
        break;
      case "faks":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { faks: val }); 
        });       
        break;  
      case "pic":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { pic: val }); 
        });       
        break;  
      case "type":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { type: val }); 
        });       
        break;  
      case "lat":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { lat: val }); 
        });       
        break;       
      case "long":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { long: val }); 
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

    //add collector func
    const addcollector = (action:string) => {

      var endpoint:string = "";

      console.log(newData);

      if (newData.daerah !== "" || newData.name !== "" || newData.alamat !== "" || newData.telefon !== null || newData.faks !== null || newData.pic !== null || newData.type !==null || newData.lat !== 0 || newData.long !== 0 ) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'collector';
            setNewData({...newData,status:"Pending"});
            break;
          case "Update":
            endpoint = API_URL + 'collector/' + newData.id;
            setNewData({...newData,status:"Pending"});
            break;
          case "Verify":
            endpoint = API_URL + 'collector/' + newData.id;
            setNewData({...newData,status:"Verified"});
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
                    setMessage(jsonRes.message);
                } else {
                  setNewData({ id:0, daerah:"", name: "", alamat:"", telefon:null, faks:null, pic:null, type:null, lat:0, long:0, status:"Pending", category:"" });
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
    
      }else{
        setMessage("Content cannot be empty!");
      }        

    }

    const addScrapedCollector = () => {

      if(scrapedData.length !== 0){

        fetch(API_URL + 'collectorbulk', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(scrapedData),
        })
        .then(async res => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                  console.log(jsonRes.message);
                  setMessage(jsonRes.message);
              } else {
                setNewData({ id:0, daerah:"", name: "", alamat:"", telefon:null, faks:null, pic:null, type:null, lat:0, long:0, status:"Pending", category:"" });
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

    }

  const updatecollector = (event:React.MouseEvent<HTMLElement>, id:number, daerah: string, name: string, alamat: string, telefon: string|null, faks: string|null, pic: string|null, type: string|null, lat: number, long: number, status: string, category: string) => {
    event.preventDefault();
    setNewData({ id:id, daerah:daerah, name:name, alamat:alamat, telefon:telefon, faks:faks, pic:pic, type:type, lat:lat, long:long, status:status, category:category});
    console.log(status);
    handleShow("Update");
  };

  //update scraped data
  const updateScrapedData = (event:React.MouseEvent<HTMLElement>,item:CollectorType,index:number) => {
    event.preventDefault();
    setIndex(index);
    setNewData({ id:item.id, daerah:item.daerah, name:item.name, alamat:item.alamat, telefon:item.telefon, faks:item.faks, pic:item.pic, type:item.type, lat:item.lat, long:item.long, status:"Pending", category:item.category});
    handleShow("Update Scraped");
  }

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

    const selectAllItems = (status:string) => {

      let temp: Array<number> = [];
      for (let index = 0; index < filteredData.length; index++) {
        if(filteredData[index].status === status) temp.push(filteredData[index].id);
      }
      setIds(temp);
    }
  
    // This function will be called when the "REMOVE SELECTED USERS" is clicked
    const removeItems = () => {

      const payload = ids;
      fetch(API_URL + 'collector/' + payload, {
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

    // useEffect(() => {
    //     console.log(scrapedData);
    //     if(scrapedData.length !== 0) setScrapShow(true);
    //     // setResultScrapedData(scrapedData);
    // }, [scrapedData])
    

    //scrap data
    const scrap = () => {

      let formdata = new FormData();
      
      let file = new File([targetPDF],targetPDF.name, {type: 'application/pdf'});
      formdata.append("pdf", file);
      

      fetch(API_URL + 'collectorscrap', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: formdata,
      })
      .then(response => response.json())
      .then(results => {

        let newObj: Array<CollectorType> = [];
        for (let index = 0; index < results.length; index++) {

          newObj[index] = {
            id:0,
            daerah: results[index][1],
            name: results[index][2],
            alamat: results[index][3],
            telefon: results[index][4],
            faks: results[index][5],
            pic: results[index][6],
            type: results[index][7],
            lat: results[index][8],
            long: results[index][9],
            status: "Pending",
            category: scrapedCategory            
          }

        }
        setScrapedData(newObj);
        setScrapShow(true);

      })
      .catch(err => {
        console.warn(err);
        // setIsLoading(false);
        // setError(err);
      });
    }

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
        const tempData:Array<CollectorType> = data.filter(
          function (item) {
            
            let itemData = "";

            switch (searchFilter) {
              case "name":
                itemData = item.name
                ? item.name.toUpperCase()
                : ''.toUpperCase();
                break;
              case "alamat":
                itemData = item.alamat
                ? item.alamat.toUpperCase()
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

  fetch(API_URL + 'collector/status/' + ids, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({status:status}),
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
  
}

  return (
    <>
    <Container>
        <h3>Collectors</h3>
        <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "" ? "button active" : "button"} onClick={()=>setStatus("")}>All</Button>
            <Button className={status == "Pending" ? "button active" : "button"} onClick={()=>setStatus("Pending")} >Pending</Button>
            <Button className={status == "Verified" ? "button active" : "button"} onClick={()=>setStatus("Verified")}>Verified</Button>
            <Button className={status == "Approved" ? "button active" : "button"} onClick={()=>setStatus("Approved")}>Approved</Button>
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
              <option value="name">By Name</option>
              <option value="alamat">By Alamat</option>
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
        {userrole === "admin" ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
          {ids.length === 0 ? 
          <>
            <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={()=>{setScrapedData([]);setScrapShow(true);}}>Scrap from PDF</Button>
            <Button style={{ backgroundColor:"green"}} onClick={(e) => {handleShow("Add")}}>Add New</Button>
          </>
          : 
            <Button style={{ backgroundColor:"red"}} onClick={removeItems}>Delete</Button>
          }
          </Col>
        </Row>    
        : <></>}

        {userrole === "officer" && 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
            <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>updateStatus("Rejected")}>Rejected</Button>
            <Button style={{ backgroundColor:"green", marginRight:"10px"}} onClick={(e)=>updateStatus("Verified")}>Verify</Button>
            <Button onClick={()=>selectAllItems("Pending")}>Check All</Button>
          </Col>
        </Row>}

        {userrole === "head" ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
            <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>updateStatus("Rejected")}>Rejected</Button>
            <Button style={{ backgroundColor:"green", marginRight:"10px"}} onClick={(e)=>updateStatus("Approved")}>Approve</Button>
            <Button onClick={()=>selectAllItems("Verified")}>Check All</Button>
          </Col>
        </Row>    
        : <></>}

        <Row className="p-2">
        {Pagination()}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>State</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone No</th>
                <th>Fax No</th>
                <th>Person-in-charge</th>
                <th>Type</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Category</th>
                <th>Status</th>             
              </tr>
            </thead>
            <tbody>
                {
                  currentRecords.map((item:CollectorType, index:number) => (
                    <tr key={`collector-${index}`} className={`collector-${index}`}>
                      <td className="daerah">
                        {item.daerah}
                      </td>
                      <td className="name">
                        <a href="#" onClick={(e) => {
                          updatecollector(e, item.id, item.daerah, item.name, item.alamat, item.telefon, item.faks, item.pic, item.type, item.lat, item.long, item.status, item.category)
                        }}>{item.name}</a>
                      </td>
                      
                      {/* <td className="name">
                        {item.name}
                      </td> */}
                      <td className="alamat">
                        {item.alamat}
                      </td>
                      <td className="telefon">
                        {item.telefon}
                      </td>
                      <td className="faks">
                        {item.faks}
                      </td>
                      <td className="pic">
                        {item.pic}
                      </td>
                      <td className="type">
                        {item.type}
                      </td>
                      <td className="lat">
                        {item.lat}
                      </td>
                      <td className="long">
                        {item.long}
                      </td>
                      <td className="category">
                        {item.category}
                      </td>
                      <td className="status">
                        {item.status}
                      </td>
                      <td className="action">
                      {userrole === "admin" || (userrole === "officer" && item.status === "Pending") || (userrole === "head" && item.status === "Verified") ? 
                      <Form.Check
                        type="checkbox"
                        value={item.id}
                        onChange={selectItem}
                        isValid={ids.includes(item.id) ? true : false}
                      />:<></>}

                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </Table>
        </Row>
    </Container>

    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} collector</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Collector Name</Form.Label>
            {modalAction === "Update" ? (
            <Form.Control type="text" placeholder="Enter Collector Name" size="sm" name="name" value={newData.name} onChange={handleNewDataChange} />
            ) : 
            <Form.Control type="text" placeholder="Enter Collector Name" size="sm" name="name" value={newData.name} onChange={handleNewDataChange} />
            }
          </Form.Group>
          <Form.Group className="mb-3" controlId="daerah">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="Enter State" size="sm" name="daerah" value={newData.daerah} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="alamat">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter Address" size="sm" name="alamat" value={newData.alamat} onChange={handleNewDataChange}/>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="telefon">
            <Form.Label>Phone No</Form.Label>
            <Form.Control type="text" placeholder="Enter Phone No" size="sm" name="telefon" value={newData.telefon?newData.telefon:undefined} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="faks">
            <Form.Label>Fax No</Form.Label>
            <Form.Control type="text" placeholder="Enter Fax No" size="sm" name="faks" value={newData.faks?newData.faks:undefined} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="pic">
            <Form.Label>Person-in-charge</Form.Label>
            <Form.Control type="text" placeholder="Enter Person-in-charge" size="sm" name="pic" value={newData.pic?newData.pic:undefined} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Control type="text" placeholder="Enter Type" size="sm" name="type" value={newData.type?newData.type:undefined} onChange={handleNewDataChange}/>
            {/* <Form.Control as="select" placeholder="Select Type" size="sm" name="type" value={newData.type} onChange={handleNewDataChange}>
              <option value="">None</option>
              <option value="TONG/ BIN KITAR SEMULA">TONG/ BIN KITAR SEMULA</option>
              <option value="Kloth Box">Kloth Box</option>
              <option value="Tong Kitar Semula (CRC Box)">Tong Kitar Semula (CRC Box)</option>
              <option value="Others">Others</option>
            </Form.Control> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" placeholder="Select Type" size="sm" name="category" value={newData.category} onChange={handleNewDataChange}>
              <option value="">None</option>
              <option value="General Waste">General Waste</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Food Waste">Food Waste</option>
              <option value="Used Cooking Oil">Used Cooking Oil</option>
            </Form.Control>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="lat">
            <Form.Label>Latitude</Form.Label>
            <Form.Control type="number" placeholder="Enter Latitude" size="sm" name="lat" value={newData.lat} onChange={handleNewDataChange}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="long">
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="number" placeholder="Enter Longitude" size="sm" name="long" value={newData.long} onChange={handleNewDataChange}/>
          </Form.Group>
        </Form>
        {message !== "" && 
        <p style={{backgroundColor:"red", color:"#fff", padding:5}}>{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {modalAction === "Update Scraped" ? 
          <Button variant="primary" onClick={(e) => {
              scrapedData[index] = newData;
              handleClose();
          }}>
            Update
          </Button>          
          :
          <Button variant="primary" onClick={(e) => {addcollector(modalAction)}}>
            Save Changes
          </Button>
          }
        </Modal.Footer>
      </Modal>


    
      <Modal show={scrapShow} aria-labelledby="contained-modal-title-vcenter" onHide={()=>setScrapShow(false)} centered className="scrap-data">
        <Modal.Header closeButton>
          <Modal.Title>Scrap Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          {scrapedData.length === 0 ? 
          <Row style={{width:"30%", margin:"auto"}}>
          <Form.Control style={{marginBottom:12}} type="file" name="scrap_pdf" size="sm" accept='.pdf' 
             onChange={(event:React.ChangeEvent<HTMLInputElement>|any)=>{
              if (event.target.files[0].length !== 0){
                setTargetPDF(event.target.files[0]);
                console.log(event.target.files[0]);
              }
            }}/>
          <Form.Control style={{marginBottom:12}} as="select" placeholder="Choose Category" size="sm" name="category" value={scrapedCategory} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setScrapedCategory(e.target.value)}>
              <option value="">None</option>
              <option value="General Waste">General Waste</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Food Waste">Food Waste</option>
              <option value="Used Cooking Oil">Used Cooking Oil</option>
            </Form.Control>
          <Button onClick={scrap}>Scrap</Button>
          </Row>
          :
          <Form.Group className="mb-3" controlId="name">
            <Table bordered hover responsive>
            <thead>
              <tr>
                <th>State</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone No</th>
                <th>Fax No</th>
                <th>Person-in-charge</th>
                <th>Type</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Category</th>
                <th>Action</th>           
              </tr>
            </thead>
            <tbody>
                {
                  scrapedData.map((item:CollectorType, index:number) => (
                    <tr key={`collector-${index}`} className={(data.find(x => x.alamat === item.alamat))?"existed":"new"}>
                      <td className="daerah">
                        {item.daerah}
                      </td>                      
                      <td className="name">
                      <a href="#" onClick={(e)=>{
                        updateScrapedData(e,item,index);
                      }}>
                        {item.name}
                      </a>
                      </td>
                      <td className="alamat">
                        {item.alamat}
                      </td>
                      <td className="telefon">
                        {item.telefon}
                      </td>
                      <td className="faks">
                        {item.faks}
                      </td>
                      <td className="pic">
                        {item.pic}
                      </td>
                      <td className="type">
                        {item.type}
                      </td>
                      <td className="lat">
                        {item.lat}
                      </td>
                      <td className="long">
                        {item.long}
                      </td>
                      <td className="category">
                        {item.category}
                      </td>
                      <td className="action">
                      {(data.find(x => x.alamat === item.alamat))? 
                      <></>
                      :
                      <a href="#" onClick={()=>{
                        var filtered = scrapedData.filter(function(value:any, index:any, arr:any){ 
                          return value.alamat !== item.alamat;
                        });
                        setScrapedData(filtered);
                      }}>
                      <Trash/>
                      </a>
                      }
                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </Table>            
          </Form.Group>
          }
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setScrapShow(false)}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={addScrapedCollector}>
            Submit
          </Button>
          {/* <Button variant="primary" onClick={(e) => {addcollector(modalAction)}}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );

};
export default Collectors;