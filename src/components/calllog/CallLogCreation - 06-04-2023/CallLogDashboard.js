import React from 'react';
// import { usePageTitle } from "../hooks/usePageTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { BsFillTelephonePlusFill } from 'react-icons/bs';
import { MdSettingsPhone } from 'react-icons/md';
import { TbPhoneCheck } from 'react-icons/tb';
import { MdPhoneInTalk } from 'react-icons/md';


const CallLogDashboard = () => {
    usePageTitle("Call Logs Dashboard")
    return (
    <div className='CallLogsDashboard'>
        <div className='title'>
            <h5>List Call</h5>
        </div>
        <div className='cards'>
            <div className='row'>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 newCall'>
                                    <div className='count'>
                                        <h4>12</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>New Calls</h4>                                        
                                    </div>  
                                    <div className='icon'> 
                                        <BsFillTelephonePlusFill />                                  
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 pendingCall'>
                                    <div className='count'>
                                        <h4>20</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Pending Calls</h4>                                        
                                    </div>    
                                    <div className='icon'>                                
                                        <MdSettingsPhone />                                    
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 updatedCall'>
                                    <div className='count'>
                                        <h4>11</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Updated Calls</h4>                                        
                                    </div>   
                                    <div className='icon'>                                 
                                        <MdPhoneInTalk />
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-12 completedCall'>
                                    <div className='count'>
                                        <h4>17</h4>                                   
                                    </div>
                                    <div className='title'>
                                        <h4>Completed & Closed Calls</h4>                                        
                                    </div>              
                                    <div className='icon'>
                                        <TbPhoneCheck />                                           
                                    </div>                    
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
    )

}

export default CallLogDashboard;