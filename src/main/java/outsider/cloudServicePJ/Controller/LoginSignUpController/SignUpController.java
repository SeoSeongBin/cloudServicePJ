package outsider.cloudServicePJ.Controller.LoginSignUpController;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import outsider.cloudServicePJ.mapper.signUpMapper;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// @RestController
public class SignUpController {
    @Autowired
    private signUpMapper signUpMapper;

    @PostMapping(value = "/signUpCertification")
    public Map<String, Object> signUpCertification(@RequestBody Map<String, Object> data) throws MessagingException{
        Map<String, Object> result = new HashMap<>();

        String hostMail = (String) data.get("id"); // 받는 사람 이메일 주소
        String fromMail = "dhsb123@naver.com"; // 발신자 아이디 (이메일 앞부분)
        String fromMailPw = "1q2w3e4r!#"; // 발신자 비밀번호

        // 등록된 계정인지 확인
        int cnt = signUpMapper.userInfoCnt(hostMail);

        if(cnt > 1){
            result.put("msg", "이미 등록된 E-mail입니다.");
        }else{

        }

        String authCode = String.format("%06d", new Random().nextInt(999999));

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.naver.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromMail, fromMailPw);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromMail)); // 보내는 사람
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(hostMail)); // 받는 사람
        message.setSubject("인증 요청 메일입니다.");
        message.setText("인증코드는: " + authCode);

        Transport.send(message);

        result.put("msg", "메일전송이 완료회었습니다.");
        return result;
    }
}
