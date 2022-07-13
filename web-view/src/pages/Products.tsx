import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Row, Table, Col, Form, Modal, Image } from "react-bootstrap";
import * as XLSX from "xlsx";
import { ArrowRight, Trash } from 'react-bootstrap-icons';

const API_URL = process.env.API_URL;

const Products = () => {

  interface ProductType {
    gtin : number;
    productName: string;
    material: string;
    material_id: number;
    recyclable: string;
    status: string;
    submit_email: string|null;
    media: string|null;
  }

  interface MaterialType {
    id: number;
    material: string;
    time: string;
    guide: string;
    category: string,
    recyclable: Array<string|null>,
    non_recyclable: Array<string|null>,
    conversion_rate: number,
    recyclable_media: Array<string|null>,
    non_recyclable_media: Array<string|null>
  }

    const inputRef = useRef<HTMLInputElement>(null);

    //scrap data
    const [excelData, setExcelData] = useState<any>([]);    

    //excel modal
    const [excelShow, setExcelShow] = useState(false);
    const [index, setIndex] = useState<number>(0);

    const handleClick = () => {
      setExcelData([]);
      if (inputRef.current !== null) {
        inputRef.current.click();
      }else console.log("null");
  }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const file:any = e.target.files;
      const reader = new FileReader();

      reader.onload = (evt:ProgressEvent<FileReader>) => {
        if(evt.target){
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const options:any = { header: 2 };
          const data = XLSX.utils.sheet_to_json(ws, options);
          setExcelData(data);
          setExcelShow(true);
        }
      };

      reader.readAsBinaryString(new Blob(file));
    };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<ProductType>>([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState<string>("");
  const [materialChoice, setMaterialChoice] = useState<Array<MaterialType>>([]);

  //status
  const [status, setStatus] = useState("");

  // The checkboxes
  const [ids, setIds] = useState<Array<number>>([]);

  //search
  const [filteredData, setFilteredData] = useState<Array<ProductType>>([]);
  const [searchFilter, setSearchFilter] = useState("GTIN");

  //Add new product
  const [newData, setNewData] = useState<ProductType>({gtin:0, productName:"", material:"", material_id:0, recyclable:"Yes", status:"Pending", submit_email:null, media:null });

  const [userrole, setUserrole] = useState("");


    // User is currently on this page
    const [currentPage, setCurrentPage] = useState(1);
    // No of Records to be displayed on each page   
    const [recordsPerPage] = useState(100);
  
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
    setMessage("");
  }
  const handleShow = (action:string) => {
    setModalAction(action);
    if (action === "Add") {
      setNewData({gtin:0, productName:"", material:"", material_id:0, recyclable:"Yes", status:"Pending", submit_email:null, media:null });
    }
    setShow(true);
  }

  //load material data
  useEffect(() => {

    fetch(API_URL + "material", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setMaterialChoice(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });    

  }, [])
  
  //load product data
  useEffect(() => {
    setIsLoading(true);

    var endpoint:string = "";
    if (status === "") {
      endpoint = API_URL + "product/";      
    }else{
      endpoint = API_URL + "product/status/" + status;
    }

    fetch(endpoint, {
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
      case "gtin":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { gtin: val }); 
        });       
        break;
      case "name":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { productName: val }); 
        });       
        break;
      case "material_id":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { material:materialChoice.find(x => x.id === parseInt(val))?.material, material_id: parseInt(val) }); 
        });       
        break;   
      case "recyclable":
        setNewData((prevVal) => {
          return Object.assign({}, prevVal, { recyclable: val }); 
        });       
        break;                 
      default:
        break;
    }
  };

  //function to check is the variable number
  function isNumeric(value:any) {
    return /^-?\d+$/.test(value);
  }

  //update excel data
  const updateExcelData = (event:React.MouseEvent<HTMLElement>,item:any,index:number) => {
    event.preventDefault();
    setIndex(index);
    var material_id:number|any = item.material ? materialChoice.find(x => x.material === item.material)?.id:0;
    setNewData({gtin:item.gtin, productName:item.productName,  material:item.material, material_id:material_id, recyclable:item.recyclable, status:"Pending", submit_email:null, media:null});
    handleShow("Update Excel");
  }

    //add product func
    const addProduct = (action:string) => {

      var endpoint:string = "";

      if(isNumeric(newData.gtin) !== true) setMessage("Product GTIN must be a number");
      else if (newData.gtin !== 0 || typeof newData.gtin !== 'number' || newData.productName !== "" || newData.recyclable !== "" || newData.material_id !== 0) {

        switch (action) {
          case "Add":
            endpoint = API_URL + 'product';
            break;
          case "Update":
            endpoint = API_URL + 'product/' + newData.gtin;
            break;
          default:
            break;
        }

        setNewData({...newData,status:"Pending"});
        let payload:any = newData;
        // payload.gtin = parseInt(payload.gtin);
        console.log(payload);

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
                  setNewData({gtin:0, productName:"", material:"", material_id:0, recyclable:"Yes", status:"Pending", submit_email:"", media:null });
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

    const addExcelProduct = () => {

      if(excelData.length !== 0){

        let productArray:Array<any> = [];
        for (let index = 0; index < excelData.length; index++) {
          let validation = (data.find(x => x.gtin === excelData[index].gtin.toString()))?"existed":"new";
          if(validation === "new"){
            let temp:any = {gtin:0, productName:"", material_id:0, recyclable:"Yes", status:"Pending", submit_email:null, media:null };
            temp.gtin = excelData[index].gtin;
            temp.productName = excelData[index].productName;
            temp.material = excelData[index].material;
            temp.material_id = materialChoice.find(x => x.material === excelData[index].material)?.id || 0;
            temp.gtin = excelData[index].gtin;
            temp.status = "Pending";
            temp.submit_email = null;
            temp.media = null;
            productArray.push(temp);
          }
        }

        fetch(API_URL + 'productbulk', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(productArray),
        })
        .then(async res => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                  console.log(jsonRes.message);
                  setMessage(jsonRes.message);
              } else {
                setNewData({gtin:0, productName:"", material:"", material_id:0, recyclable:"Yes", status:"Pending", submit_email:null, media:null });
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

    //update
  const updateProduct = (event:React.MouseEvent<HTMLElement>, gtin:number, productName:string, material:string, material_id:number|any, recyclable:string, status:string, submit_email:string|null, media:string|null) => {
    event.preventDefault();
    setNewData({gtin:gtin, productName:productName,  material:material, material_id:material_id, recyclable:recyclable, status:status, submit_email:submit_email, media:media});
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

    const selectAllItems = (status:string) => {

      let temp: Array<number> = [];
      for (let index = 0; index < filteredData.length; index++) {
        if(filteredData[index].status === status) temp.push(filteredData[index].gtin);
      }
      setIds(temp);
    }
  
  
    // This function will be called when the "REMOVE SELECTED USERS" is clicked
    const removeItems = () => {

      const payload = ids;
      fetch(API_URL + 'product/' + payload, {
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
        const tempData:Array<ProductType> = data.filter(
          function (item) {
            
            let itemData = "";

            switch (searchFilter) {
              case "GTIN":
                itemData = item.gtin.toString();
                break;
              case "productName":
                itemData = item.productName
                ? item.productName.toUpperCase()
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

  fetch(API_URL + 'product/status/' + ids, {
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
        <h3>Products</h3>
        <Row className="py-2">
        <Col className="status-button">
            <Button className={status == "" ? "button all active" : "button"} onClick={()=>setStatus("")} >All</Button>
            <Button className={status == "Pending" ? "button pending active" : "button"} onClick={()=>setStatus("Pending")} >Pending</Button>
            <Button className={status == "Waiting" ? "button waiting active" : "button"} onClick={()=>setStatus("Verified")} >Verified</Button>
            <Button className={status == "Approved" ? "button solved active" : "button"} onClick={()=>setStatus("Approved")}>Approved</Button>
            <Button className={status == "Rejected" ? "button rejected active" : "button"} onClick={()=>setStatus("Rejected")}>Rejected</Button>
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
              <option value="GTIN">By GTIN</option>
              <option value="productName">By Product Name</option>
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
        {userrole === "admin" ? 
        <Row>
        <Col md={{ span: 4, offset: 8 }} style={{ textAlign:"right"}}>
          {ids.length === 0 ? 
          <>
            <Button style={{ backgroundColor:"purple", marginRight:"10px"}} onClick={handleClick}>Load From Excel File</Button>
            <Form.Group controlId="formFile" className="mb-3" style={{display:"none"}}>
              <Form.Control type="file" ref={inputRef} onChange={onChange}/>
            </Form.Group>
            <Button style={{ backgroundColor:"green"}} onClick={(e) => {handleShow("Add")}}>Add New</Button>
          </>
          : 
          <>
            <Button style={{ backgroundColor:"red"}} onClick={removeItems}>Delete</Button>
          </>
          }
          </Col>
        </Row>
        :<></>}

        {userrole === "officer" && ids.length !== 0 ? 
        <Row>
          <Col md={{ span: 8, offset: 4 }} style={{ textAlign:"right"}}>
            <Button style={{ backgroundColor:"brown", marginRight:"10px"}} onClick={(e)=>updateStatus("Rejected")}>Rejected</Button>
            <Button style={{ backgroundColor:"green", marginRight:"10px"}} onClick={(e)=>updateStatus("Verified")}>Verify</Button>
            <Button onClick={()=>selectAllItems("Pending")}>Check All</Button>
          </Col>
        </Row>    
        : <></>}

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
                <th>GTIN</th>
                <th>Product Name</th>
                <th>Recyclable</th>
                <th>Material</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {
                  currentRecords.map((item:ProductType, index:number) => (
                    <tr key={`product-${index}`} className={`product-${index}`}>
                      <td className="gtin">
                        {item.gtin}
                      </td>
                      <td className="productname">
                        <a href="#" onClick={(e) => {
                          updateProduct(e, item.gtin, item.productName, item.material, item.material_id, item.recyclable, item.status, item.submit_email, item.media)
                        }}>{item.productName}</a>
                      </td>                      
                      <td className="recyclable">
                        {item.recyclable}
                      </td>
                      <td className="material_id">
                        {item.material}
                      </td>
                      <td className="status">
                        {item.status}
                      </td>
                      <td className="action">
                      {userrole === "admin" || (userrole === "officer" && item.status === "Pending") || (userrole === "head" && item.status === "Verified") ? 
                      <Form.Check
                        type="checkbox"
                        value={item.gtin}
                        onChange={selectItem}
                        isValid={ids.includes(item.gtin) ? true : false}
                      />
                      : <></>}
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
          <Modal.Title>{modalAction} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column">
        {newData.media &&
          <Image src={API_URL + "static/products/" + newData.media} style={{height:250, width:"auto", margin:"0 auto"}}/>
        }
        <Form>
          <Form.Group className="mb-3" controlId="gtin">
            <Form.Label>Product GTIN</Form.Label>
            {modalAction === "Update" ? (
            <Form.Control type="number" placeholder="Enter Product GTIN" size="sm" name="gtin" value={newData.gtin} onChange={handleNewDataChange} readOnly/>
            ) : 
            <Form.Control type="number" placeholder="Enter Product GTIN" size="sm" name="gtin" value={newData.gtin} onChange={handleNewDataChange} />
            }
          </Form.Group>
          <Form.Group className="mb-3" controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Product Name" size="sm" name="name" value={newData.productName} onChange={handleNewDataChange}/>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="recyclable">
            <Form.Label>Recyclable?</Form.Label>
            <Form.Control as="select" placeholder="Choose Recyclable" size="sm" name="recyclable" value={newData.recyclable} onChange={handleNewDataChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="partly">Partly</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="material_id">
            <Form.Label>Material</Form.Label>
            <Form.Control as="select" placeholder="Choose Material" size="sm" name="material_id" value={newData.material_id} onChange={handleNewDataChange}>
              <option value="">None</option>
              {materialChoice.map((item:MaterialType, index:number) => (
                <option key={index} value={item.id}>{item.material}</option>
              ))}
            </Form.Control>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="submit_email">
            <Form.Label>Submit by</Form.Label>
            <Form.Control type="text" size="sm" name="submit_email" value={newData.submit_email?newData.submit_email:""} readOnly/>
          </Form.Group>

        </Form>
        {message !== "" && 
        <p style={{backgroundColor:"red", color:"#fff", padding:5}}>{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {modalAction === "Update Excel" ? 
          <Button variant="primary" onClick={(e) => {
              excelData[index] = newData;
              handleClose();
          }}>
            Update
          </Button>          
          :
          <Button variant="primary" onClick={(e) => {addProduct(modalAction)}}>
            Save Changes
          </Button>
          }
        </Modal.Footer>
      </Modal>

      <Modal show={excelShow} aria-labelledby="contained-modal-title-vcenter" onHide={()=>setExcelShow(false)} centered className="scrap-data">
        <Modal.Header closeButton>
          <Modal.Title>Excel Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{display:"flex"}}>
            <div style={{height:20, width:20, backgroundColor:"#c7b3b3",marginBottom:10, marginRight:6}}></div>
            <p>Existed</p>
          </div>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Table bordered hover responsive>
            <thead>
              <tr>
                <th>GTIN</th>
                <th>Product Name</th>
                <th>Material</th>
                <th>Recyclable</th>
                <th>Action</th>           
              </tr>
            </thead>
            <tbody>
                {
                  excelData.map((item:any, index:number) => (
                    <tr key={`product-${index}`} className={(data.find(x => x.gtin === item.gtin.toString()))?"existed":"new"}>
                      <td className="GTIN">
                        {item.gtin}
                      </td>                      
                      <td className="productName">
                      {(data.find(x => x.gtin === item.gtin.toString()))?
                      item.productName
                      :
                      <a href="#" onClick={(e)=>{
                        updateExcelData(e,item,index);
                      }}>{item.productName}</a>
                      }
                      </td>
                      <td className="material">
                        {item.material_id?
                        materialChoice.find(x => x.id === item.material_id)?.material
                        :
                        item.material
                        }
                        {}
                      </td>
                      <td className="recyclable">
                        {item.recyclable}
                      </td>
                      <td className="action">
                      {(data.find(x => x.gtin === item.gtin.toString())) ? 
                      <></>
                      :
                      <a href="#" onClick={()=>{
                        var filtered = excelData.filter(function(value:any, index:any, arr:any){ 
                          return value.gtin !== item.gtin;
                        });
                        setExcelData(filtered);
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
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setExcelShow(false)}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={addExcelProduct}>
            Submit
          </Button>
          {/* <Button variant="primary" onClick={(e) => {addproduct(modalAction)}}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>

    </>
  );
};



export default Products;