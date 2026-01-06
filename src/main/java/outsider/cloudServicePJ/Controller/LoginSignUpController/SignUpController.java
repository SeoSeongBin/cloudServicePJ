package outsider.cloudServicePJ.Controller.LoginSignUpController;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import outsider.cloudServicePJ.mapper.signUpMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignUpController {
    @Autowired
    private signUpMapper signUpMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping(value = "/signUpCertification")
    public Map<String, Object> signUpCertification(@RequestBody Map<String, Object> data) throws MessagingException{
        Map<String, Object> result = new HashMap<>();

        // 받는 사람 이메일 주소
        String hostMail = (String) data.get("id"); 
        // 발신자 아이디 (이메일 앞부분)
        String fromMail = "dhsb123@naver.com"; 
         // 발신자 비밀번호
        String fromMailPw = "K2GQF34937NS";
        try{
            // 등록된 계정인지 확인
            int cnt = signUpMapper.userInfoCntData(hostMail);
            System.out.println("cnt : "+ cnt+"@@@@@@@@@@@@@@@@@@@@@@@");
            
            if(cnt > 0){
                result.put("msg", "이미 등록된 E-mail입니다.");
            }else{
                String authCode = String.format("%06d", new Random().nextInt(999999));

                data.put("auth_code", authCode);
    
                Properties props = new Properties();
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.host", "smtp.naver.com");
                props.put("mail.smtp.port", "465");
    
                // SSL을 사용하는 465 포트를 위한 필수 설정
                props.put("mail.smtp.ssl.enable", "true"); 
                props.put("mail.smtp.ssl.trust", "smtp.naver.com");
                props.put("mail.smtp.socketFactory.port", "465");
                props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                props.put("mail.smtp.socketFactory.fallback", "false");

                Session session = Session.getInstance(props, new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(fromMail, fromMailPw);
                    }
                });
    
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(fromMail)); // 보내는 사람
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(hostMail)); // 받는 사람
                message.setSubject("인증 요청 메일입니다.");
                message.setText("인증코드: " + authCode);
                
                // 테이블에 인증코드 insert
                signUpMapper.signUpAuthInsertData(data);
                // 메일 전송과 인증
                Transport.send(message);
    
                result.put("msg", "인증메일을 발송하였습니다.");
            }
        }catch(Exception e){
            e.printStackTrace(); // 또는 로깅
            result.put("success", false);
            result.put("msg", "메일 전송중 오류가 발생했습니다.");
        }

        return result;
    }
    @PostMapping(value = "/signUpAuth")
    public Map<String, Object> signUpAuth(@RequestBody Map<String, Object> data) throws MessagingException{
        Map<String, Object> result = new HashMap<>();
        try{
            // 인증 요청 내역이 있는지 확인
            int cnt = signUpMapper.authInfoCntData(data);
            if(cnt == 0){
                result.put("msg", "인증요청을 해주세요.");
            }else{
                // 인증코드 일치 확인
                int authCnt = signUpMapper.authCodeCntData(data);
                // 인증코드 일치하지 않을 시
                if(authCnt == 0){
                    result.put("msg", "인증번호가 일치하지 않습니다.");
                // 인증코드 일치 시
                }else{
                    signUpMapper.signUpAuthUpData(data);
                    result.put("msg", "메일인증이 완료되었습니다.");
                }
            }
            result.put("success", true);
        }catch(Exception e){
            e.printStackTrace(); // 또는 로깅
            result.put("success", false);
            result.put("msg", "인증중 오류가 발생하였습니다.");
        }
        return result;
    }
    
    @PostMapping(value = "/signUpInsert")
    public Map<String, Object> signUpInsert(@RequestBody Map<String, Object> data) throws MessagingException{
        Map<String, Object> result = new HashMap<>();
        try{
            // pw오브젝트를 가져와서 String으로 변경
            String stringPw = data.get("pw").toString();
            // string으로 만든 pw값을 암오화
            String encodePw = passwordEncoder.encode(stringPw);
            // 암호화된 pw값을 기존 pw값에 덮어 씌우기
            data.put("pw", encodePw);
            
            Integer cnt = signUpMapper.authYNInfoCntData(data);
            
            if(cnt < 0){
                result.put("msg", "인증을 완료해주세요.");
            }else{
                Integer phoneNumCnt = signUpMapper.signUpChkPhoneNum(data);
                
                if(phoneNumCnt > 0){
                    result.put("msg", "이미 가입되어있는 번호입니다.");
                }else{
                    signUpMapper.signUpInsertData(data);
                    result.put("msg", "가입이 완료되었습니다.");
                    result.put("status", true);
                }
            }
            result.put("success", true);
        }catch(Exception e){
            e.printStackTrace(); // 또는 로깅
            result.put("success", false);
            result.put("msg", "인증중 오류가 발생하였습니다.");
        }

        return result;
    }
}
