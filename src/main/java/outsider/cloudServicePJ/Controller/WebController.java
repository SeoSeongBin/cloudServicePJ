package outsider.cloudServicePJ.Controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import outsider.cloudServicePJ.VO.LoginVO;
import outsider.cloudServicePJ.mapper.LoginMapper;

@Controller
public class WebController {
    @Autowired
    private LoginMapper loginMapper; // 1. 여기서 선언한 이름을 확인하세요!

    @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String redirect() {
        return "forward:/index.html";
    }
    
    @RequestMapping("/api/session-check")
    @ResponseBody
    public Map<String, Object> checkSession(HttpServletRequest request) {
        System.out.println("===Get Session===");
        HttpSession session = request.getSession(false); // false: 없으면 null 반환
        Map<String, Object> result = new HashMap<>();
        
        if (session != null && session.getAttribute("loginUser") != null) {
            result.put("loggedIn", true);
            result.put("user", session.getAttribute("loginUser"));
            System.out.println("===Session Success===");
        } else {
            result.put("loggedIn", false);
            System.out.println("===Session N/A===");
        }
        return result;
    }

    @RequestMapping("/api/getSessionUser")
    @ResponseBody
    public Map<String, Object> getSession(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        HttpSession session = request.getSession(false);
        
        // 세션에서 Object로 꺼내기
        Object sessionObj = (session != null) ? session.getAttribute("loginUser") : null;

        if (sessionObj == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        } else {
            // LoginVO로 형변환 (Casting)
            LoginVO user = (LoginVO) sessionObj;
            
            // 아이디(email)값을 변수화
            String email = user.getUI_EMAIL(); 

            // email을 Map<String, Object> 으로 변환
            Map<String, Object> paramMap = new HashMap<>();
            // 아이디(email)값을 Map<String, Object>에 담기
            paramMap.put("id", email);
            
            // 아이디를 이용해서 데이터 조회 및 VO를 이용해서 형변환
            LoginVO detailData = loginMapper.LoginUserData(paramMap);
            
            // 유저 정보 프론트에 넘겨주기위해 담기
            result.put("userInfo", detailData);
            result.put("user", user);
        }
        return result;
    }


}