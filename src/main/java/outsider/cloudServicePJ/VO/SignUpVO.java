package outsider.cloudServicePJ.VO;

import java.sql.Date;

import lombok.Data;

@Data
public class SignUpVO {
    private String UCEL_ID;
    private String UCEL_UI_EMAIL;
    private String UCEL_UI_NAME;
    private String UCEL_AUTH_CODE;
    private Date UCEL_REG_DATE;
    private String UCEL_AUTH_YN;
    private Date UCEL_AUTH_DATE;
    private Integer CNT;
    private String UCEL_AUTH_VALIDITY;
}
