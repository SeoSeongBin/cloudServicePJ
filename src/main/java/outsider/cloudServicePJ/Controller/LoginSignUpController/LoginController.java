package outsider.cloudServicePJ.Controller.LoginSignUpController;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import outsider.cloudServicePJ.VO.LoginVO;
import outsider.cloudServicePJ.mapper.LoginMapper;

@RestController
public class LoginController {
    @Autowired
    private LoginMapper loginMapper;

    @RequestMapping(value = "/loginFunction")
    public Map<String, Object> Login(@RequestParam String id, @RequestParam String pw, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        LoginVO user = loginMapper.LoginFunction(id, pw);
        String msg;
        try{
            if(user == null){
                msg = "아이디 또는 비밀번호가 올바르지 않습니다.";
                result.put("success", false);
                result.put("msg", msg);
            }else{
                HttpSession session = request.getSession();
                session.setAttribute("loginUser", user);    // 로그인 사용자 정보를 세션에 저장
                session.setMaxInactiveInterval(30 * 60);

                result.put("success", true);
                result.put("msg", "로그인 성공");
            }
        }catch(Exception e){
                e.printStackTrace(); // 또는 로깅
                result.put("success", false);
                result.put("msg", "로그인 처리 중 오류가 발생했습니다.");
        }
        return result;
    }

}
