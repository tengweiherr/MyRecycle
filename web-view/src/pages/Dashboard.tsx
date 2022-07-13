import React, { useEffect, useState } from 'react'
import { Bar, ChartProps } from 'react-chartjs-2'
import Box from '../components/box/Box'
import DashboardWrapper, { DashboardWrapperMain, DashboardWrapperRight } from '../components/dashboard-wrapper/DashboardWrapper'
import SummaryBox, { SummaryBoxSpecial } from '../components/summary-box/SummaryBox'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { API_URL } from "../API_URL";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = () => {

  interface UserStateType {
    states: Array<string>;
    amount: Array<number>;
  }

  const [userData, setUserData] = useState();
  const [collectorData, setCollectorData] = useState();
  const [productData, setProductData] = useState();
  const [reportData, setReportData] = useState();
  const [reportStatus, setReportStatus] = useState<string>("Pending");
  const [reportSelectedData, setReportSelectedData] = useState();
  const [rewardData, setRewardData] = useState();

  const [userStateData, setUserStateData] = useState({
    states: ['Johor', 'Kedah', 'Kelantan', 'Malacca', 'N9', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'],
    amount: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  });

  const [userrole, setUserrole] = useState("");

  //get user role
  const getRole = async () => {
    try {
      const value = await localStorage.getItem('userRole');
      if (value !== null) {
        // We have data!!
        setUserrole(value);
        switch (value) {
            case "admin":
                setReportStatus("Pending");
                break;
            case "officer":
                setReportStatus("Verified");
                break;
            case "head":
                setReportStatus("In Progress");
                break;        
            default:
                break;
        }
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

    useEffect(() => {
      getRole();
    }, []);

//load recycler data
useEffect(() => {

    fetch(API_URL + 'user/role/recycler', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setUserData(results);
        let temp:Array<number> = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        for (let index = 0; index < results.length; index++) {

            //loop all states
            for (let anotherIndex = 0; anotherIndex < userStateData.states.length; anotherIndex++) {
                //find the same one
                if(userStateData.states[anotherIndex] === results[index].state){
                    temp[anotherIndex]++;
                }
            }
        }

        setUserStateData({...userStateData, amount:temp});

        // console.log(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [])

//load collector data
useEffect(() => {

    fetch(API_URL + 'collector/approved', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setCollectorData(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [])

//load product data
useEffect(() => {

    fetch(API_URL + 'product/status/approved', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setProductData(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [])


//load report data
useEffect(() => {

    fetch(API_URL + 'report/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setReportData(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [])

//load solved report data
useEffect(() => {

    fetch(API_URL + 'report/status/' + reportStatus, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setReportSelectedData(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [reportStatus])

//load reward data
useEffect(() => {

    fetch(API_URL + 'reward/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setRewardData(results);
      })
      .catch(err => {
        console.warn(err);
      });

}, [])
    
    return (
        <DashboardWrapper>
            <DashboardWrapperMain>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row"> 
                            {userrole === "admin" ? 
                            <h1 className='mx-3 py-3'>Admin Dashboard</h1>
                            : <></>}
                            {userrole === "officer" ? 
                            <h1 className='mx-3 py-3'>JPSPN Officer Dashboard</h1>
                            : <></>}
                            {userrole === "head" ? 
                            <h1 className='mx-3 py-3'>Head of JPSPN Officer Dashboard</h1>
                            : <></>}
                        </div>
                        <div className="row">
                            <div className="col-4 col-md-4 col-sm-12 mb">
                                <SummaryBox title="Active Recyclers" data={userData} />
                            </div>
                            <div className="col-4 col-md-4 col-sm-12 mb">
                                <SummaryBox title="Active Collectors" data={collectorData} />
                            </div>
                            <div className="col-4 col-md-4 col-sm-12 mb">
                                <SummaryBox title="Active Products" data={productData} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 col-md-4 col-sm-12 mb">
                                <SummaryBox title="Reports Received" data={reportData} />
                            </div>
                            <div className="col-4 col-md-4 col-sm-12 mb">
                                {userrole === "admin" ? 
                                <SummaryBox title="Report Pending" data={reportSelectedData} />
                                :<></>}
                                {userrole === "officer" ? 
                                <SummaryBox title="Report to be verified" data={reportSelectedData} />
                                :<></>}
                                {userrole === "head" ? 
                                <SummaryBox title="Report to be solved" data={reportSelectedData} />
                                :<></>}
                            </div>
                        </div>                                                

                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Box>
                            <div className="title mb">
                                Users by states
                            </div>
                            <div>
                                <Bar data={
                                {
                                    labels: userStateData.states,
                                    datasets: [
                                        {
                                            label: 'Amount',
                                            data: userStateData.amount
                                        }
                                    ]
                                }
                                } height={`100px`} />
                            </div>
                        </Box>
                    </div>
                </div>
            </DashboardWrapperMain>
            {/* <DashboardWrapperRight>
                <div className="title mb">Overall</div>
                <div className="mb">
                    <OverallList />
                </div>
                <div className="title mb">Revenue by channel</div>
                <div className="mb">
                    <RevenueList />
                </div>
            </DashboardWrapperRight> */}
        </DashboardWrapper>
    )
}

export default Dashboard
