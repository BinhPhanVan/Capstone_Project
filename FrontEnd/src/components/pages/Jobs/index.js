import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { selectIsLoading } from "../../../store/ResumeSlice";
import { get_active, selectIsActive } from "../../../store/UserSlice";
import SpinnerLoading from "../../commons/SpinnerLoading";

function Jobs() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(selectIsLoading);
    const is_active = useSelector(selectIsActive);
    useEffect(() => {
        dispatch(get_active());
    }, [dispatch]);
    useEffect(() => {
        if(is_active)
        {
          navigate("/jobs/search/");
        }
        else
        {
          navigate("/jobs/turn-on/");
        }
      }, [is_active, navigate]);
    return (
        <div>
            <SpinnerLoading loading={loading}/>
            <Outlet/>
        </div>
    );
}

export default Jobs;
