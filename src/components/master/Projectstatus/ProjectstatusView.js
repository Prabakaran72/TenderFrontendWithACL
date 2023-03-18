import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import ProjectstatusList from "./ProjectstatusList";


const ProjectstatusView = () => {
    usePageTitle("Project Status Master List");

    return (
        <>
          {/* Page Heading */}
          <div className="container-fluid p-0">
            <motion.div className="card t-card shadow mb-4"
               initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="float-right">
                      <Link
                        to="projectstatuscreation"
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
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <ProjectstatusList />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      );
}

export default ProjectstatusView;