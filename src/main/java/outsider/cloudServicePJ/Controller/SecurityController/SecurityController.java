package outsider.cloudServicePJ.Controller.SecurityController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityController {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화 (개발 시 편리함)
            .formLogin(AbstractHttpConfigurer::disable) // ★ 기본 로그인 폼 비활성화
            .headers(headers -> headers.frameOptions(options -> options.disable())) // H2 콘솔 등을 쓸 경우 대비
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // 모든 요청에 대해 인증 없이 허용
            );
        
        return http.build();
    }
}
