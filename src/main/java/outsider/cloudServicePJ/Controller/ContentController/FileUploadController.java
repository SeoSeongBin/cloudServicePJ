package outsider.cloudServicePJ.Controller.ContentController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FileUploadController {
    
    @RequestMapping("/api/upload")
    public Map<String, Object> fileUpload(@RequestBody Map<String, Object> data) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        
        return result;
    }

    @RequestMapping("/api/newFolder")
    public Map<String, Object> newFolder(@RequestBody Map<String, Object> data) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        return result;
    }
}
