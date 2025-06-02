package outsider.cloudServicePJ.Controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WebController {
    @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String redirect() {
        return "forward:/index.html";
    }
    
    @RequestMapping("/api/session-check")
    @ResponseBody
    public Map<String, Object> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // false: 없으면 null 반환
        Map<String, Object> result = new HashMap<>();
        
        if (session != null && session.getAttribute("loginUser") != null) {
            result.put("loggedIn", true);
            result.put("user", session.getAttribute("loginUser"));
        } else {
            result.put("loggedIn", false);
        }
        return result;
    }


}