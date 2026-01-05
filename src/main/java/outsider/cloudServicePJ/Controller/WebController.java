package outsider.cloudServicePJ.Controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class WebController {
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
        Object user = session.getAttribute("loginUser");
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
            }else{
                result.put("user", user);
            }
        return result;
    }


}