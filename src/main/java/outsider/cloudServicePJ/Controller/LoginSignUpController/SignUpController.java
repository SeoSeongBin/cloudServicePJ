package outsider.cloudServicePJ.Controller.LoginSignUpController;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignUpController {
    @RequestMapping(value = "/signUpCertification")
    public Map<String, Object> signUpCertification(@RequestParam String id) throws MessagingException{
        Map<String, Object> result = new HashMap<>();

        String hostMail = id; // 받는 사람 이메일 주소
        String fromMail = "dhsb123@naver.com"; // 발신자 아이디 (이메일 앞부분)
        String fromMailPw = "1q2w3e4r!#"; // 발신자 비밀번호

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
