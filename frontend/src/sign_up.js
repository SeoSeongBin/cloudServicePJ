import React, {useState} from "react";

function Sign_up() {
    let [frontMail, setFrontMail] = useState("");
    let [endMail, setEndMail] = useState("");

    // 인증버튼 클릭시 작동하는 로직
    const certificationFuntion = () => {
                fetch("/signUpCertification", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        id: frontMail+"@"+endMail,
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.error("인증 메일 발송에 실패했습니다:", err);
                    alert("인증 메일 발송에 실패했습니다.");
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
                <div className="sign_up_pw">
                    <p>비밀번호</p>
                    <input
                        type="password"
                        className="pw"
                        placeholder="비밀번호를 입력해주세요"
                    />
                </div>
                <div className="sign_up_pw">
                    <p>비밀번호 재확인</p>
                    <input
                        type="password"
                        className="pw_check"
                        placeholder="비밀번호를 다시 입력해주세요"
                    />
                </div>
                <div className="sign_up_phone">
                    <p>핸드폰 뒷자리</p>
                    <input
                        type="text"
                        className="phone_num"
                        maxlength="4"
                        placeholder="핸드폰 뒤 4자리를 입력해주세요"
                    />
                </div>
                <div className="sign_up_btn_area">
                    <button className="sign_up_btn">가입하기</button>
                </div>
            </div>

        </div>
    )
}

export default Sign_up;