package outsider.cloudServicePJ.VO;

import lombok.Data;

@Data
public class FileManageVO {
    private Integer FM_ID;
    private String FM_UI_USER_EMAIL;
    private String FM_FILE_NAME;
    private String FM_FILE_PATH;
    private Long FM_FILE_SIZE;
    private String FM_FILE_EXTENSION_TYPE;
    private String FM_FILE_TYPE;
	private Integer FM_UP_FILE_ID;
    // 파일 join을 위해 추가
    private String UI_BACK_SEAT_PHONE_NUM;

    // 경로를 위해 추가
    private String FULL_PATH;

    // 사용중인 용량 표기를 위한 값
    private Long USE_STORAGE;
}