import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import UnitMasterList from "./UnitMasterList";


const UnitMasterView = () => {
  usePageTitle("Unit Creation");
  return (
    <>
      {/* Page Heading */}
      <div className="container-fluid p-0">
        <motion.div className="card t-card shadow mb-4"
           initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                <div className="col-6 text-left ml-3"> <h6 className="m-0 font-weight-bold text-primary">UNIT MASTER LIST</h6></div>
                <div className="col-5 text-right ml-5">
                  <Link
                    to="unitcreation"
                    className="btn btn-primary btn-icon-split "
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text">New</span>
                  </Link>
                </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
                <UnitMasterList/>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UnitMasterView;
