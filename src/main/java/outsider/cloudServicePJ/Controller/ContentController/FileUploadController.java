package outsider.cloudServicePJ.Controller.ContentController;

import java.io.File;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StreamUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import org.springframework.util.StreamUtils;

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
            String phoneNum = user.getUI_BACK_SEAT_PHONE_NUM();

            Object upIdObj = data.get("upId");
            Integer upId = 0; // 기본값 설정
            if (upIdObj != null) {
                upId = Integer.parseInt(String.valueOf(upIdObj));
            }
            vo.setUI_BACK_SEAT_PHONE_NUM(phoneNum);
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
        HttpServletRequest request
    ) throws Exception {
        
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

        try {
            // 세션 처리
            HttpSession session = request.getSession(false);
            // 세션에서 가져온 email(id)값 변수처리
            LoginVO user = (LoginVO) session.getAttribute("loginUser");

            // 경로 지정
            File saveDir = new File(osPath+uploadPath+user.getUI_EMAIL());
            
            // 폴더가 없으면 생성
            if (!saveDir.exists()) {
                saveDir.mkdirs();
            }
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

    @RequestMapping("/api/fileDown")
    @ResponseBody 
    public Map<String, Object> fileDown(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<>();

        // 1. 유저 정보 및 세션 체크
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            result.put("status", "null");
            return result;
        }
        LoginVO user = (LoginVO) session.getAttribute("loginUser");
        String userId = user.getUI_EMAIL();

        // 2. OS별 경로 설정
        String os = System.getProperty("os.name").toLowerCase();
        String osPath = os.contains("win") ? "C:/cloud_storage" : System.getProperty("user.home") + "/cloud_storage";

        // 3. 파일 정보 가져오기
        Object fileIdObj = data.get("fileId");
        if (fileIdObj == null) {
            result.put("status", "fail");
            return result;
        }
        
        int fileId = Integer.parseInt(fileIdObj.toString());
        FileManageVO vo = new FileManageVO();
        vo.setFM_ID(fileId);

        FileManageVO resultVO = mainMapper.fileData(vo);
        
        if (resultVO == null) {
            result.put("status", "not_found");
            return result;
        }

        // 4. 실제 파일 객체 생성
        String path = osPath +"/uploads/"+ userId + "/" + resultVO.getFM_FILE_NAME();
        File file = new File(path);

        if (file.exists()) {
            // 5. 다운로드를 위한 응답 헤더 설정
            // 한글 파일명 깨짐 방지 인코딩
            String encodedFileName = URLEncoder.encode(resultVO.getFM_FILE_NAME(), "UTF-8").replaceAll("\\+", "%20");
            
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFileName + "\"");
            response.setContentLength((int) file.length());

            // 6. 파일 읽어서 전송 (try-with-resources로 스트림 자동 닫기)
            try (InputStream is = new FileInputStream(file);
                OutputStream osStream = response.getOutputStream()) {
                StreamUtils.copy(is, osStream);
                osStream.flush();
            }
            
            // 파일 전송 후에는 Map을 리턴해도 무시되므로 null을 반환하거나 종료합니다.
            return null; 
        } else {
            result.put("status", "file_not_exists");
            return result;
        }
    }

    @RequestMapping("/api/newFolder")
    @ResponseBody
    public Map<String, Object> newFolder(
        @RequestBody Map<String, Object> data, 
        HttpServletRequest request
    ) throws Exception {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 세션 및 유저 정보 검증
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            result.put("status", "null");
            return result;
        }
        LoginVO user = (LoginVO) session.getAttribute("loginUser");
        
        try {
            // 2. 전달 데이터 파싱 (안전하게 변환)
            String folderName = String.valueOf(data.get("fileName"));
            // React에서 같이 보낸 parentId가 있다면 data에서 꺼냄
            int parentId = data.get("parentId") != null ? Integer.parseInt(String.valueOf(data.get("parentId"))) : 0;

            // 3. OS별 경로 설정
            String os = System.getProperty("os.name").toLowerCase();
            String rootPath = os.contains("win") ? "C:" : System.getProperty("user.home");
            
            // 실제 저장될 물리 경로 (예: C:/upload/유저이메일/폴더명)
            // 유저별로 공간을 분리하는 것이 보안상 좋습니다.
            String relativePath = uploadPath + user.getUI_EMAIL() + "/" + folderName;
            File saveDir = new File(rootPath + relativePath);
            
            // 4. 물리 폴더 생성 및 체크
            if (saveDir.exists()) {
                result.put("status", "error");
                result.put("message", "이미 존재하는 폴더명입니다.");
                return result;
            }

            if (!saveDir.mkdirs()) {
                throw new Exception("폴더 생성에 실패했습니다.");
            }

            // 5. DB 기록
            FileManageVO vo = new FileManageVO();
            vo.setFM_FILE_NAME(folderName); // 폴더 이름 저장
            vo.setFM_FILE_PATH("/uploads/" + folderName); // 접근 경로 저장
            vo.setFM_FILE_TYPE("D"); // Directory의 'D'
            vo.setFM_UI_USER_EMAIL(user.getUI_EMAIL());
            vo.setFM_UP_FILE_ID(parentId);
            vo.setFM_FILE_EXTENSION_TYPE(""); // 폴더는 확장자 없음

            mainMapper.fileUploadData(vo);
            
            result.put("status", "success");
            result.put("message", "폴더가 생성되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "서버 오류: " + e.getMessage());
        }
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

                    String fileType = fileData.getFM_FILE_TYPE();

                    // select 한 데이터가 존재할경우 해당 경로에 존재하는 파일 제거
                    if(fileData != null){
                        // 파일경로
                        String filePath = osPath+"/uploads/"+fileData.getFM_UI_USER_EMAIL()+"/"+fileData.getFM_FILE_NAME();
                        // 해당 경로 파일 변수지정

                        if ("D".equals(fileType)){
                            
                            File folder = new File(filePath);
                            System.out.println("exists=" + folder.exists());
                            System.out.println("isDirectory=" + folder.isDirectory());
                            System.out.println("absolutePath=" + folder.getAbsolutePath());
                            if (folder.exists()) {
                                // 하위 파일 및 폴더를 포함하여 전체 삭제
                                boolean success = FileSystemUtils.deleteRecursively(folder);
                                
                                if (success) {
                                    System.out.println("폴더 및 하위 항목 삭제 완료");
                                }
                            }
                        }else{
                            File file = new File(filePath);
                            if(file.exists()) {
                                file.delete();
                            }
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
