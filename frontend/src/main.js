import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate,Outlet } from "react-router-dom";

function Main() {

    const navigate = useNavigate();

    function getSession() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            fetch('/api/getSessionUser', {
                method: 'GET',
                credentials: 'include', // ✅ 쿠키 포함
            })
                .then(res => {
                    // 401 Unauthorized인 경우 바로 로그인 페이지로 이동
                    if (res.status === 401) {
                        navigate("/login");
                        return null; 
                    }
                    if (!res.ok) throw new Error("시스템 오류");
                    return res.json();
                })
                .then(data => {
                    if(data == null){
                        navigate("/login");
                    }
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