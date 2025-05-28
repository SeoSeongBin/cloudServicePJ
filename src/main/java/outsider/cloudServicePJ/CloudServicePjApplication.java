package outsider.cloudServicePJ;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("outsider.cloudServicePJ.mapper")
@SpringBootApplication
public class CloudServicePjApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudServicePjApplication.class, args);
	}

}
