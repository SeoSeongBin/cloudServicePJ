import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate,Outlet } from "react-router-dom";

function Main() {
    function getSession() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            fetch('/api/getSessionUser', {
                method: 'GET',
                credentials: 'include', // ✅ 쿠키 포함
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                });
                }, []);
    }

    getSession();
    return (
        <div>
            <div id="header"></div>
            <div id="navi"></div>
            <div id="contents">
                <Outlet />
            </div>
            <div id="footer"></div>
        </div>
    );

}

export default Main;