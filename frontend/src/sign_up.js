import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"; // 상단에 추가

function Sign_up() {
    // 메일 앞 @ 이전 
    let [frontMail, setFrontMail] = useState("");
    // 메일 뒤 @ 이후
    let [endMail, setEndMail] = useState("");
    // 이름
    let [name, setName] = useState("");
    // 인증번호
    let [auth, setAuth] = useState("");
    // 비밀번호
    let [pw, setPw] = useState("");
    // 비밀번호 확인
    let [pwChk, setPwChk] = useState("");
    // 핸드폰 뒷자리
    let [phoneNum, setPhoneNum] = useState("");
    // 비밀번호 동일한지 확인
    let [pwChkAuth, setPwChkAuth] = useState(null);
    // 모든내용이 입력되었는지 확인
    let [allReady, setAllReady] = useState(null);

    // 인증코드 요청 로직
    const certificationFuntion = () => {
        if(frontMail == "" && endMail == "") {
            alert("이메일을 입력해주세요");
            return;
        }
        fetch("/signUpCertification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: frontMail+"@"+endMail,
                name: name
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            alert(data.msg);
        })
        .catch((err) => {
            console.error("인증 메일 발송에 실패했습니다:", err);
            alert("오류가 발생하였습니다.");
        });
    }
    // 인증요청 로직
    const signUpAuthBtnFuntion = () => {
        fetch("/signUpAuth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: frontMail+"@"+endMail,
                auth_code: auth
            })
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data.msg);
        })
        .catch((err) => {
            console.error("본인인증에 오류가 발생하였습니다. : ", err);
            alert("오류가 발생하였습니다.");
        });
    }
    // 비밀번호 확인로직
    useEffect(() => {
        if (pw !== "" && pwChk !== "") {
            setPwChkAuth(pw === pwChk);
        } else {
            setPwChkAuth(null); // 아무것도 입력 안 한 상태
        }
    }, [pw, pwChk]);
    // 회원가입 버튼 활성 비활성
    useEffect(() => {
        if(
            name != "" &&
            pw != ""&&
            pwChk != ""&&
            pwChkAuth == true&&
            phoneNum != ""
        ){
            setAllReady(true);
        }else{
            setAllReady(false)
        }
    },[name, pw, pwChk, pwChkAuth, phoneNum])
    // 회원가입 버튼작동 로직
    const signUpBtnFuntion = () => {
        if(name == ""){
            alert("이름을 입력해주세요.");
            return;
        }
        if(pw == ""){
            alert("비밀번호를 입력해주세요.");
            return;
        }
        if(pwChk == ""){
            alert("비밀번호 확인을 입력해주세요.");
            return;
        }
        if(pwChkAuth != true) {
            alert("비밀번호와 비밀번호 확인을 일치하게 입력해주세요");
            return
        }
        if(phoneNum == ""){
            alert("핸드폰 뒷자리를 입력해주세요.");
            return;
        }
        fetch("/signUpInsert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: frontMail+"@"+endMail,
                phone_num: phoneNum,
                name: name,
                pw: pw,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data.msg);

            if(data.status == true){
                navigate("/login");
            }
        })
        .catch((err) => {
            console.error("본인인증에 오류가 발생하였습니다. : ", err);
            alert("오류가 발생하였습니다.");
        });
    }
    return(
        <div className="sign_up_wrap">
            <div className="sign_up_area">
                <h2 className="login_logo">CloudProject</h2>
                <div className="sign_up_name">
                    <p>이름(닉네임)</p>
                    <input
                        type="text"
                        className="name"
                        placeholder="이름(닉네임)을 입력해주세요"
                        onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className="sign_up_id">
                    <p>아이디(E-mail)</p>
                    <input
                        type="text"
                        className="idVal1"
                        placeholder="이메일을 입력해주세요"
                        onChange={(e) => setFrontMail(e.target.value)}
                    />
                    <span>@</span>
                    <input
                        type="text" 
                        className="idVal3"
                        onChange={(e) => setEndMail(e.target.value)}
                    />
                    <button className="certification_btn" onClick={certificationFuntion}>인증요청</button>
                </div>
                <div className="sign_up_auth">
                    <p>본인인증</p>
                    <input
                        type="text"
                        placeholder="인증번호를 입력해주세요."
                        onChange={(e) => setAuth(e.target.value)}
                    />
                    <button className="auth_btn" onClick={signUpAuthBtnFuntion}>인증</button>
                </div>
                <div className="sign_up_pw">
                    <p>비밀번호</p>
                    <input
                        type="password"
                        className="pw"
                        placeholder="비밀번호를 입력해주세요"
                        onChange={(e) => setPw(e.target.value)}
                        
                    />
                </div>
                <div className="sign_up_pw">
                    <p>비밀번호 확인</p>
                    <input
                        type="password"
                        className="pw_check"
                        placeholder="비밀번호를 다시 입력해주세요"
                        onChange={(e) => setPwChk(e.target.value)}
                    />
                    {pwChkAuth === null && (
                        <p className="">비밀번호 확인을 입력해주세요.</p>
                    )}
                    {pwChkAuth === false && (
                        <p className="red">비밀번호가 일치하지 않습니다.</p>
                    )}
                    {pwChkAuth === true && (
                        <p  className="green">비밀번호가 일치합니다.</p>
                    )}
                </div>
                <div className="sign_up_phone">
                    <p>핸드폰 뒷자리</p>
                    <input
                        type="text"
                        className="phone_num"
                        maxlength="4"
                        placeholder="핸드폰 뒤 4자리를 입력해주세요"
                        onChange={(e)=>setPhoneNum(e.target.value)}
                    />
                </div>
                <div className="sign_up_btn_area">
                    {/* 위 아래 두가지 방법 다 사용가능 */}
                    {/* {(allReady === false || allReady === null) && (
                        <button className="sign_up_btn">가입하기</button>
                    )}
                    {allReady === true && (
                        <button className="sign_up_btn on" onClick={signUpBtnFuntion}>가입하기</button>
                    )} */}
                    <button
                        className={`sign_up_btn ${allReady ? "on" : ""}`}
                        disabled={!allReady}
                        onClick={allReady ? signUpBtnFuntion : undefined}
                    >
                        가입하기
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Sign_up;