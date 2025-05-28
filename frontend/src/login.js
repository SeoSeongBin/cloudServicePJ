import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
        let [idFocused, setIdFocused] = useState(false);
        let [pwFocused, setPwFocused] = useState(false);
        let [idVal, setId] = useState("");
        let [pwVal, setPw] = useState("");
        let msg = "";
        let navigate = useNavigate();

        // 로그인 클릭 작동
        const loginBtnFuntion = () => {
            if(idVal == "" && pwVal == ""){
                msg = "아이디, 비밀번호를 입력해주세요";
                alert(msg);
                return;
            }else if(idVal == ""){
                msg = "아이디를 입력해주세요";
                alert(msg);
                return;
            }else if(pwVal == ""){
                msg = "비밀번호를 입력해주세요";
                alert(msg);
                return;
            }else{
                fetch("/loginFunction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        id: idVal,
                        pw: pwVal
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.msg == '' || data.msg == null) {
                        alert("개발중입니다.");
                    } else {
                        alert(data.msg);
                    }
                })
                .catch((err) => {
                    console.error("로그인 오류:", err);
                    alert("서버 요청 중 오류가 발생했습니다.");
                });
            }

        }
  return (
    <div className="login_wrap">
        <div className="login_box">
            <h2 className="login_logo">CloudProject</h2>
            <div className="login_input_area">
                <div className={`login_id_box ${idFocused ? 'on' : ''}`}>
                    <p>아이디를 입력해주세요</p>
                    <input
                        type="text"
                        className="id"
                        value={idVal}
                        onFocus={() => setIdFocused(true)}
                        onBlur={() => setIdFocused(false)}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className={`login_pw_box ${pwFocused ? 'on' : ''}`} >
                    <p>비밀번호를 입력해주세요</p>
                    <input
                        type="password"
                        className="pw"
                        value={pwVal}
                        onFocus={() => setPwFocused(true)}
                        onBlur={() => setPwFocused(false)}
                        onChange={(e) => setPw(e.target.value)}
                    />
                </div>
            </div>
            <div className="login_btn_area">
                <button className="login_btn" onClick={loginBtnFuntion}>로그인</button>
                <button className="sign_up" onClick={() => navigate("/sign_up")}>회원가입</button>
            </div>
        </div>
    </div>
  );
}

export default Login;