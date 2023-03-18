import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Masterlayout from "./components/Masterlayout";
import Dashboard from "./components/Dashboard";
import Tendertracker from "./components/tender/Tendertracker/Tendertracker";
import Tendercreation from "./components/tender/Tendercreation/Tendercreation";
import Legacystatement from "./components/tender/Legacystatement/Legacystatement";
import Bidmanagement from "./components/tender/Bidmanagement/Bidmanagement";
import { AuthContextProvider } from "./storeAuth/auth-context";
import AuthContext from "./storeAuth/auth-context";
// import Master from "./components/master/Master";
import StateMaster from "./components/master/StateMaster/StateMaster";
import ULBMaster from "./components/master/ULBMaster/ULBMaster";
import ULBMasterView from "./components/master/ULBMaster/ULBMasterView";
import CustomerCreation from "./components/master/CustomerCreation/CustomerCreation";
import CompetitorCreation from "./components/master/CompetitorMaster/CompetitorCreation";
import Competitor from "./components/master/CompetitorMaster/Competitor";
import CompetitorProfile from "./components/master/CompetitorMaster/CompetitorProfile";
import CompetitorDetails from "./components/master/CompetitorMaster/CompetitorDetails";
//import CompetitorBranch from "./components/master/CompetitorMaster/Competitor_Details/CompetitorBranch";
import CompetitorBranchForm from "./components/master/CompetitorMaster/Competitor_Details/CompetitorBranch/CompetitorBranchForm";
import CustomerCreationProfile from "./components/master/CustomerCreation/CustomerCreationProfile/CustomerCreationProfile";
import CustomerCreationMain from "./components/master/CustomerCreation/CustomerCreationMain";
import CustomerCreationContactPerson from "./components/master/CustomerCreation/CustomerCreationContactPerson/CustomerCreationContactperson";
// import CustomerCreationBankDetails from "./components/master/CustomerCreation/CustomerCreationBankdetails";
import CustomerCreationSWMProjectStatus from "./components/master/CustomerCreation/SWMProjectStatus/CustomerCreationSWMProjectStatus";
import StateMasterView from "./components/master/StateMaster/StateMasterView";
import CountryMasterView from "./components/master/CountryMaster/CountryMasterView";
import CountryMaster from "./components/master/CountryMaster/CountryMaster";
import UnitMaster from "./components/master/UnitMaster/UnitMaster";
import UnitMasterView from "./components/master/UnitMaster/UnitMasterView";
import TenderTypeMaster from "./components/master/TenderTypeMaster/TenderTypeMaster";
import TenderTypeMasterView from "./components/master/TenderTypeMaster/TenderTypeMasterView";
import DistrictMaster from "./components/master/DistrictMaster/DistrictMaster";
import DistrictMasterView from "./components/master/DistrictMaster/DistrictMasterView";
import CityMasterView from "./components/master/CityCreation/CityMasterView";
import CityCreation from "./components/master/CityCreation/CityCreation";
import CustomerCreationUlbDetails from "./components/master/CustomerCreation/ULBDetails/CustomerCreationUlbDetails";
import ProjectTypeView from "./components/master/ProjectType/ProjectTypeView";
import ProjectstatusView from "./components/master/Projectstatus/ProjectstatusView";
import ProejctTypeMaster from "./components/master/ProjectType/ProjectTypeMaster";
import CustSubCategView from "./components/master/CustomerSubCategory/CustSubCategView";
import CustSubCategMaster from "./components/master/CustomerSubCategory/CustSubCategMaster";
import ProjectstatusMaster from "./components/master/Projectstatus/ProjectstatusMaster";
import CustomerCreationBankDetails from "./components/master/CustomerCreation/Bankdetails/CustomerCreationBankdetails";
import BidmanagementMain from "./components/tender/Bidmanagement/BidmanagementMain";
import BidCreationMain from "./components/tender/Bidmanagement/Bidcreation/BidCreationMain";
import BidSubmission from "./components/tender/Bidmanagement/Bidsubmission/BidSubmission";
import TenderStatus from "./components/tender/Bidmanagement/TenderStatus/TenderStatus";
import Workorder from "./components/tender/Bidmanagement/Workorder/Workorder";
import CommunicationFilesView from "./components/Library/CommunicationFiles/CommunicationFilesView";
import CommunicationFilesCreation from "./components/Library/CommunicationFiles/CommunicationFilesCreation";
import axios from "axios";
import { can } from "./components/UserPermission";
import Unauthorized from "./components/pages/Unauthorized";
import UserCreationView from "./components/master/UserCreation/UserCreationView";
import UserTypeView from "./components/master/UserType/UserTypeView";
import UserType from "./components/master/UserType/UserType";
import UserCreation from "./components/master/UserCreation/UserCreation";

function App() {
  const authData = useContext(AuthContext);
  // const [role, setRole] = useState([]); 
  // const [permission, setPermission] = useState([]); 

  // useEffect(() => {
  //   const rolesPermission = async () => {
  //     if(localStorage.getItem('token')){

  //     let data = {
  //       tokenid : localStorage.getItem('token')
  //     }

        
  //     let rolesAndPermission = await axios.post(`http://localhost:8000/api/getrolesandpermision`, data)
  //       if(rolesAndPermission.status === 200){
  //         console.log('sdada', rolesAndPermission.data)
  //         setRole(rolesAndPermission.data.role);
  //         setPermission(rolesAndPermission.data.permission) 
  //       }
  //     }
  //   }

  //   rolesPermission()
  // }, [])

  return (
   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* {authCtx.isLoggedIn && ( */}
          <Route path="/tender" element={<Masterlayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tendertracker" element={can('tenderTracker-list' , (authData.permission || [])) ? <Tendertracker /> : <Unauthorized/>} />
            <Route path="tendercreation" element={can('tenderCreation-create' , (authData.permission || [])) ? <Tendercreation /> : <Unauthorized/>} />
            <Route path="legacystatement" element={can('legacyStatment-list' , (authData.permission || [])) ? <Legacystatement /> : <Unauthorized/>} />
            <Route path="bidmanagement">
              <Route path="list" element={can('bidsManagement-list' , (authData.permission || [])) ? <Bidmanagement /> : <Unauthorized/>} />
              <Route path="list/main" element={can('bidsManagement-create' , (authData.permission || [])) ? <BidmanagementMain /> : <Unauthorized/>}>
                <Route path="bidcreationmain/:tenderid" element={can('bidsManagement-edit' , (authData.permission || [])) ? <BidCreationMain /> : <Unauthorized/>} />
                <Route
                  path="bidcreationmain/:tenderid/:id"
                  element={can('bidsManagement-edit' , (authData.permission || [])) ? <BidCreationMain /> : <Unauthorized/>}
                />
                <Route path="bidsubmission" element={can('bidsManagement-create' , (authData.permission || [])) ? <BidSubmission /> : <Unauthorized/>} />
                <Route path="bidsubmission/:id" element={can('bidsManagement-edit' , (authData.permission || [])) ? <BidSubmission /> : <Unauthorized/>} />
                <Route path="tenderstatus" element={can('bidsManagement-create' , (authData.permission || [])) ? <TenderStatus /> : <Unauthorized/>} />
                <Route path="tenderstatus/:id" element={can('bidsManagement-edit' , (authData.permission || [])) ? <TenderStatus /> : <Unauthorized/>} />
                <Route path="workorder" element={can('bidsManagement-create' , (authData.permission || [])) ? <Workorder /> : <Unauthorized/>} />
                <Route path="workorder/:id" element={can('bidsManagement-edit' , (authData.permission || [])) ? <Workorder /> : <Unauthorized/>} />
              </Route>
            </Route>
            <Route path="master">
             {can('customer-list' , (authData.permission || [])) && <Route
                path="customercreation/list"
                element={<CustomerCreation />}
              />}
              <Route
                path="customercreation/list/main"
                element={<CustomerCreationMain />}
              >
                {can('customer-create' , (authData.permission || [])) && <Route path="profile" element={<CustomerCreationProfile />} />}
               {can('customer-edit' , (authData.permission || [])) && <Route
                  path="profile/:id"
                  element={<CustomerCreationProfile />}
                />}
                {can('customer-create' , (authData.permission || [])) && <Route
                  path="contactperson"
                  element={<CustomerCreationContactPerson />}
                />}
                {can('customer-edit' , (authData.permission || [])) && <Route
                  path="contactperson/:id"
                  element={<CustomerCreationContactPerson />}
                />}
               {can('customer-create' , (authData.permission || [])) && <Route
                  path="ulbdetails"
                  element={<CustomerCreationUlbDetails />}
                />}
               {can('customer-edit' , (authData.permission || [])) && <Route
                  path="ulbdetails/:id"
                  element={<CustomerCreationUlbDetails />}
                />}
                {can('customer-create' , (authData.permission || [])) && <Route
                  path="bankdetails"
                  element={<CustomerCreationBankDetails />}
                />}
               {can('customer-edit' , (authData.permission || [])) && <Route
                  path="bankdetails/:id"
                  element={<CustomerCreationBankDetails />}
                />}
                {can('customer-create' , (authData.permission || [])) && <Route
                  path="swmprojectstatus"
                  element={<CustomerCreationSWMProjectStatus />}
                />}
               {can('customer-edit' , (authData.permission || [])) && <Route
                  path="swmprojectstatus/:id"
                  element={<CustomerCreationSWMProjectStatus />}
                />}
              </Route>
              <Route
                path="customercreation/tabs"
                element={<CustomerCreationProfile />}
              />
              <Route
                path="competitorcreation"
                element={can('competitor-list' , (authData.permission || []))  ? <CompetitorCreation /> : <Unauthorized/>}
              />

              <Route
                path="competitorcreation/competitor"
                element={<Competitor />}
              >
                <Route path="profile" element={can('competitor-create' , (authData.permission || [])) ? <CompetitorProfile /> : <Unauthorized/>} />
                <Route path="profile/:id" element={can('competitor-edit' , (authData.permission || [])) ?  <CompetitorProfile /> : <Unauthorized/>} />
                <Route path="details" element={<CompetitorDetails />}>
                  <Route path="branches" element={can('competitor-create' , (authData.permission || [])) ? <CompetitorBranchForm /> : <Unauthorized/>} />
                </Route>

                {/*route for to edit with id*/}
                <Route path="details/:compid" element={<CompetitorDetails />}>
                  <Route
                    path="branches/:compid"
                    element={can('competitor-edit' , (authData.permission || [])) ? <CompetitorBranchForm /> : <Unauthorized/> }
                  />
                </Route>
              </Route>

              <Route path="statemaster">
                <Route index element={can('state-list' , (authData.permission || [])) ? <StateMasterView /> : <Unauthorized/>} />
                <Route path="statecreation" element={can('state-create' , (authData.permission || [])) ? <StateMaster /> : <Unauthorized/>} />
                <Route path="statecreation/:id" element={can('state-edit' , (authData.permission || [])) ? <StateMaster /> : <Unauthorized/>} />
              </Route>
              <Route path="countrymaster">
                <Route index element={can('country-list' , (authData.permission || []))  ? <CountryMasterView /> : <Unauthorized/>} />
                <Route path="countrycreation" element={can('country-create' , (authData.permission || [])) ? <CountryMaster /> : <Unauthorized/>} />
                <Route path="countrycreation/:id" element={can('country-edit' , (authData.permission || [])) ? <CountryMaster /> : <Unauthorized/>} />
              </Route>
              <Route path="ulbmaster">
                <Route index element={<ULBMasterView />} />
                <Route path="ulbcreation" element={<ULBMaster />} />
                <Route path="ulbcreation/:id" element={<ULBMaster />} />
              </Route>
              <Route path="unitmaster">
                <Route index element={can('unit-list' , (authData.permission || []))  ? <UnitMasterView /> : <Unauthorized/>} />
                <Route path="unitcreation" element={can('unit-create' , (authData.permission || []))  ? <UnitMaster /> : <Unauthorized/>} />
                <Route path="unitcreation/:id" element={can('unit-edit' , (authData.permission || []))  ? <UnitMaster /> : <Unauthorized/>} />
              </Route>

              <Route path="tendertypemaster">
                <Route index element={can('tenderType-list' , (authData.permission || []))  ? <TenderTypeMasterView /> : <Unauthorized/>} />
                <Route
                  path="tendertypecreation"
                  element={can('tenderType-create' , (authData.permission || []))  ? <TenderTypeMaster /> : <Unauthorized/>}
                />
                <Route
                  path="tendertypecreation/:id"
                  element={can('tenderType-edit' , (authData.permission || []))  ?  <TenderTypeMaster /> : <Unauthorized/>}
                />
              </Route>

              <Route path="districtmaster">
                <Route index element={can('district-list' , (authData.permission || [])) ?  <DistrictMasterView /> : <Unauthorized/>} />
                <Route path="districtcreation" element={can('district-create' , (authData.permission || [])) ?  <DistrictMaster /> : <Unauthorized/>} />
                <Route
                  path="districtcreation/:id"
                  element={can('district-edit' , (authData.permission || [])) ?  <DistrictMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="citymaster">
                <Route index element={can('city-list' , (authData.permission || [])) ? <CityMasterView /> :  <Unauthorized/>} />
                <Route path="citycreation" element={can('city-create' , (authData.permission || [])) ? <CityCreation /> :  <Unauthorized/>} />
                <Route path="citycreation/:id" element={can('city-edit' , (authData.permission || [])) ? <CityCreation /> :  <Unauthorized/>} />
              </Route>
              <Route path="usertype">
                <Route index element={can('userType-list' , (authData.permission || [])) ? <UserTypeView /> :  <Unauthorized/>} />
                <Route path="create" element={can('userType-create' , (authData.permission || [])) ? <UserType /> :  <Unauthorized/>} />
                <Route path="edit/:id" element={can('userType-edit' , (authData.permission || [])) ? <UserType /> :  <Unauthorized/>} />
              </Route>
              <Route path="usercreation">
                <Route index element={can('userCreation-list' , (authData.permission || [])) ? <UserCreationView/> :  <Unauthorized/>} />
                <Route path="create" element={can('userCreation-create' , (authData.permission || [])) ? <UserCreation /> :  <Unauthorized/>} />
                <Route path="edit/:id" element={can('userCreation-edit' , (authData.permission || [])) ? <UserCreation /> :  <Unauthorized/>} />
              </Route>
              <Route path="projecttype">
                <Route index element={can('projectType-list' , (authData.permission || []))  ?  <ProjectTypeView /> : <Unauthorized/>} />
                <Route
                  path="projecttypecreation"
                  element={can('projectType-create' , (authData.permission || []))  ? <ProejctTypeMaster /> : <Unauthorized/>}
                />
                <Route
                  path="projecttypecreation/:id"
                  element={can('projectType-edit' , (authData.permission || []))  ? <ProejctTypeMaster /> : <Unauthorized/>}
                />
              </Route>
              <Route path="projectstatus">
                <Route index element={can('projectStatus-list' , (authData.permission || []))  ? <ProjectstatusView /> :<Unauthorized/>} />
                <Route
                  path="projectstatuscreation"
                  element={can('projectStatus-create' , (authData.permission || []))  ? <ProjectstatusMaster /> :<Unauthorized/>}
                />
                <Route
                  path="projectstatuscreation/:id"
                  element={can('projectStatus-edit' , (authData.permission || []))  ? <ProjectstatusMaster /> :<Unauthorized/>}
                />
              </Route>
              <Route path="test">
                <Route index element={can('projectStatus-list' , (authData.permission || []))  ? <ProjectstatusView /> :<Unauthorized/> } />
                <Route
                  path="projectstatuscreation"
                  element={can('projectStatus-create' , (authData.permission || []))  ? <ProjectstatusMaster /> : <Unauthorized/>}
                />
                <Route
                  path="projectstatuscreation/:id"
                  element={can('projectStatus-edit' , (authData.permission || []))  ? <ProjectstatusMaster /> :<Unauthorized/> }
                />
              </Route>
              <Route path="customersubcategory">
                <Route index element={can('customerSubCategory-edit' , (authData.permission || []))  ? <CustSubCategView /> :<Unauthorized/>} />
                <Route
                  path="customersubcategorycreation"
                  element={can('customerSubCategory-edit' , (authData.permission || []))  ? <CustSubCategMaster /> :<Unauthorized/>}
                />
                <Route
                  path="customersubcategorycreation/:id"
                  element={can('customerSubCategory-edit' , (authData.permission || []))  ? <CustSubCategMaster /> :<Unauthorized/>}
                />
              </Route>
              {/* <Route path="communicationfiles" >
                <Route index element={<CommunicationFilesView />} />
                <Route path="communicationfilescreation" element={<CommunicationFilesCreation />}/>
                <Route path="communicationfilescreation/:id" element={<CommunicationFilesCreation />}/>
              </Route> */}
            </Route>

            <Route path="library">
              <Route path="communicationfiles" >
                <Route index element={can('communicationFiles-list' , (authData.permission || []))  ? <CommunicationFilesView /> : <Unauthorized/>} />
                <Route path="communicationfilescreation" element={can('communicationFiles-create' , (authData.permission || []))  ? <CommunicationFilesCreation /> : <Unauthorized/>}/>
                <Route path="communicationfilescreation/:id" element={can('communicationFiles-edit' , (authData.permission || []))  ? <CommunicationFilesCreation /> : <Unauthorized/>}/>
              </Route>
            </Route>
          </Route>

          {/* )} */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
   
  );
}

export default App;
