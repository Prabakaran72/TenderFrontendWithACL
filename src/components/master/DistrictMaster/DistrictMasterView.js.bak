import { motion } from "framer-motion";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { usePageTitle } from "../../hooks/usePageTitle";
//import { can } from "../../UserPermission";
import DistrictMasterList from "./DistrictMasterList";

const DistrictMasterView = () => {
  usePageTitle("District Master");
  const {permission} = useContext(AuthContext)

  return (
    <>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <div className="card shadow mb-4">
          <motion.div className="card-body"
             initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                <div className="col-6 text-left ml-3"> <h6 className="m-0 font-weight-bold text-primary">DISTRICT MASTER LIST</h6></div>
                <div className="col-5 text-right ml-5">
          
                 {!!(permission?.Districts?.can_add) && <Link
                    to="districtcreation"
                    className="btn btn-primary btn-icon-split rounded-pill"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text">New</span>
                  </Link>}
                </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <DistrictMasterList/>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DistrictMasterView;
