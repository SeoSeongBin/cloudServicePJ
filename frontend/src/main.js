import React, {useEffect, useState} from "react";
import Navi from './NaviTemp';
import Header from './Header';
import { BrowserRouter, Routes, Route, Navigate, useNavigate,Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Main() {
    
    return (
        <div>
            <Header />
            <Navi />
            <div id="contents">
                <Outlet />
            </div>
            <div id="footer"></div>
        </div>
    );

}

export default Main;