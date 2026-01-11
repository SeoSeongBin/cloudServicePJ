package outsider.cloudServicePJ.Controller.ContentController;

import java.util.HashMap;
import java.util.Map;

import outsider.cloudServicePJ.VO.FileManageVO;
import outsider.cloudServicePJ.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FileUploadController {
    @Autowired
    private MainMapper mainMapper;

    @RequestMapping("/api/upload")
    public Map<String, Object> fileUpload(@RequestBody Map<String, Object> data) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 1. VO 객체 생성 및 데이터 매핑
            FileManageVO vo = new FileManageVO();
            
            // 리액트에서 보낸 필드명과 맞춰주세요 (예: name, type, userEmail 등)
            vo.setFM_FILE_NAME((String) data.get("name"));
            vo.setFM_FILE_TYPE((String) data.get("type")); // 'D'(폴더) 또는 'F'(파일)
            vo.setFM_UI_USER_EMAIL((String) data.get("userEmail"));
            
            // 상위 폴더 ID가 있다면 세팅 (없으면 0 혹은 NULL)
            if(data.get("parentId") != null) {
                vo.setFM_UP_FILE_ID(Integer.parseInt(data.get("parentId").toString()));
            }

            // 2. 매퍼 호출 (DB Insert)
            mainMapper.fileUploadData(vo);
            
            result.put("status", "success");
            result.put("message", "등록 성공");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        
        return result;
    }

    @RequestMapping("/api/newFolder")
    public Map<String, Object> newFolder(@RequestBody Map<String, Object> data) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        return result;
    }
}
