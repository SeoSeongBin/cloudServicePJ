import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 필요한 것만 import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const navigate = useNavigate();

    // 유저명 변수 지정
    const [userNM, setUserNM] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const toggleUserInfo = () => {
        setIsOpen(!isOpen);
    };

    // 세션정보 가져오기
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetch('/api/getSessionUser', {
            method: 'GET',
            credentials: 'include',
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
            if(data){
                // 로그인 정보가 존재할 경우 유저명 세팅
                setUserNM(data.userInfo.ui_NAME);
            }else{
                navigate("/login");
            }
        });
    }, []);

    // 로그아웃
    function sesseionOut(){
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then(res => {
            if(res.status == "success"){
                setUserNM("");
                setIsOpen(false);
                navigate("/login");
            }else{
                navigate("/login");
            }
        });
    }
    return (
        <div id="header">
            <div className="header_left">
                <h1 className="logo">Cloude Project</h1>
            </div>
            <div className="header_center"></div>
            <div className="header_right">
                <div className="header_user_ui_wrap">
                    <p className="user_info_wrap" onClick={toggleUserInfo}>
                        {userNM} <span><FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} /></span>
                    </p>
                    <div className={`header_ui_select_wrap ${isOpen ? "" : "dn"}`}>
                        <p>회원정보 <span><FontAwesomeIcon icon={faCircleUser} /></span></p>
                        {/* 함수 이름을 sessionOut으로 맞춤 */}
                        <p onClick={sesseionOut} style={{cursor:'pointer'}}>
                            로그아웃 <span><FontAwesomeIcon icon={faRightFromBracket} /></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}