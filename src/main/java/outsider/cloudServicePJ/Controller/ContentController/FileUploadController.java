package outsider.cloudServicePJ.Controller.ContentController;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import outsider.cloudServicePJ.VO.FileManageVO;
import outsider.cloudServicePJ.VO.LoginVO;
import outsider.cloudServicePJ.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class FileUploadController {
    @Autowired
    private MainMapper mainMapper;
    // 파일 경로 변수화
    @Value("${file.uploadPath}")
    private String uploadPath;

    @RequestMapping("/api/fileList")
    @ResponseBody
    public Map<String, Object> fileList(@RequestBody Map<String, Object> data, HttpServletRequest request) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 파일 vo 세팅
            FileManageVO vo = new FileManageVO();

            // 로그인 정보 가오
            HttpSession session = request.getSession(false);
            // 세션에서 가져온 email(id)값 변수처리
            LoginVO user = (LoginVO) session.getAttribute("loginUser");

            String email = user.getUI_EMAIL();
            // String phoneNum = user.getUI_BACK_SEAT_PHONE_NUM();

            Object upIdObj = data.get("upId");
            Integer upId = 0; // 기본값 설정
            if (upIdObj != null) {
                upId = Integer.parseInt(String.valueOf(upIdObj));
            }

            // vo.setUI_BACK_SEAT_PHONE_NUM(phoneNum);
            vo.setFM_UI_USER_EMAIL(email);
            vo.setFM_UP_FILE_ID(upId);
            // 1. Mapper를 통해 DB에서 리스트를 가져옴
            // (Mapper 인터페이스의 리턴 타입이 List<FileManageVO>여야 합니다)
            List<FileManageVO> list = mainMapper.fileListData(vo);
            
            // 2. 결과를 Map에 담음
            result.put("status", "success");
            result.put("list", list);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", e.getMessage());
            System.out.println("list 문 에러로 빠질때");
        }
        
        return result;
    }

    @RequestMapping("/api/upload")
    @ResponseBody
    public Map<String, Object> fileUpload(
        @RequestParam("files") List<MultipartFile> files, // 파일 리스트 받기
        @RequestParam(value = "parentId", required = false, defaultValue = "0") int parentId, // parentId 받기
        HttpServletRequest request) throws Exception {
        
        Map<String, Object> result = new HashMap<>();
        // 현재 사용 OS 변수화
        String os = System.getProperty("os.name").toLowerCase();
        // 경로 전역변수
        String osPath;

        // window 일 경우 경로
        if(os.contains("win")){
            osPath = "C:";
        // Linux/Mac 일 경우 경로
        }else{
            osPath = System.getProperty("user.home");
        }

        // 경로 지정
        File saveDir = new File(osPath+uploadPath);
        
        // 폴더가 없으면 생성
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }
        try {
            // 세션 처리
            HttpSession session = request.getSession(false);
            // 세션에서 가져온 email(id)값 변수처리
            LoginVO user = (LoginVO) session.getAttribute("loginUser");
            String email = user.getUI_EMAIL();

            // 넘어온 파일들을 하나씩 꺼내서 DB에 등록
            for (MultipartFile file : files) {
                String originalFileName = file.getOriginalFilename();
                
                // 2. 실제 파일 저장
                // File.separator를 사용하여 OS에 맞는 경로 구분자 처리
                File targetFile = new File(saveDir, originalFileName);
                file.transferTo(targetFile); 

                // 3. DB에는 브라우저가 접근 가능한 '가상 경로' 혹은 '파일명' 저장
                FileManageVO vo = new FileManageVO();
                vo.setFM_FILE_NAME(originalFileName);
                
                // DB에는 실제 경로보다는 접근 가능한 URL용 경로를 저장하는 것이 관례입니다.
                // 예: /uploads/test.jpg
                vo.setFM_FILE_PATH("/uploads/" + originalFileName); 
                
                vo.setFM_FILE_SIZE(file.getSize());
                vo.setFM_FILE_TYPE("F");
                vo.setFM_UI_USER_EMAIL(email);
                vo.setFM_UP_FILE_ID(parentId);
                
                // 확장자 세팅
                String ext = "";
                if(originalFileName.contains(".")) {
                    ext = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
                }
                vo.setFM_FILE_EXTENSION_TYPE(ext);

                mainMapper.fileUploadData(vo);
            }
                
                result.put("status", "success");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        
        return result;
    }

    @RequestMapping("/api/newFolder")
    @ResponseBody
    public Map<String, Object> newFolder(@RequestBody Map<String, Object> data) throws Exception{
        Map<String, Object> result = new HashMap<>();
        
        return result;
    }

    @RequestMapping("/api/fileDelete")
    @ResponseBody
    public Map<String, Object> fileDelete(
        @RequestParam(value = "files") List<Long> ids,
        HttpServletRequest request
    ) throws Exception{
        Map<String, Object> result = new HashMap<>();
        // 세션 처리
            HttpSession session = request.getSession(false);
        try{
            // 현재 사용 OS 변수화
            String os = System.getProperty("os.name").toLowerCase();
            // 경로 전역변수
            String osPath;

            // window 일 경우 경로
            if(os.contains("win")){
                osPath = "C:/cloud_storage";
            // Linux/Mac 일 경우 경로
            }else{
                osPath = System.getProperty("user.home")+"/cloud_storage";
            }

            if(session == null){
                result.put("status", "null");
            }else{
                for (Long fileId : ids) {
                    // fileId값을 intger값으로 변환
                    Integer fileIdInt = fileId.intValue();
                    // 여기서 mainMapper.deleteFileData(fileId) 로직 수행
                    FileManageVO vo = new FileManageVO();
                    // 변환한 Integer값 적용
                    vo.setFM_ID(fileIdInt);
                    
                    // file id에 해당하는 data select
                    FileManageVO fileData = mainMapper.fileData(vo);

                    // select 한 데이터가 존재할경우 해당 경로에 존재하는 파일 제거
                    if(fileData != null){
                        // 파일경로
                        String filePath = osPath+fileData.getFM_FILE_PATH();
                        // 해당 경로 파일 변수지정
                        File file = new File(filePath);
                        if(file.exists()) {
                            file.delete();
                        }
                        // db에서 데이터 삭제
                        mainMapper.fileDelteData(vo);
                    }
                }
                result.put("status", "success");
                result.put("message", "삭제되었습니다.");
            }

        }catch (Exception e){
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }
}
