package outsider.cloudServicePJ.VO;

import lombok.Data;

@Data
public class FileManageVO {
    private Integer FM_ID;
    private String FM_UI_USER_EMAIL;
    private String FM_FILE_NAME;
    private String FM_FILE_PATH;
    private Integer FM_FILE_SIZE;
    private String FM_FILE_EXTENSION_TYPE;
    private String FM_FILE_TYPE;
	private Integer FM_UP_FILE_ID;
}