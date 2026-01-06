package outsider.cloudServicePJ.mapper;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface signUpMapper {
    public Integer userInfoCntData(String id);
    public Integer authInfoCntData(Map<String, Object> data);
    public Integer authYNInfoCntData(Map<String, Object> data);
    public Integer authCodeCntData(Map<String, Object> data);
    public Integer signUpChkPhoneNum(Map<String, Object> data);
    public void signUpAuthInsertData(Map<String, Object> data);
    public void signUpAuthUpData(Map<String, Object> data);
    public void signUpInsertData(Map<String, Object> data);
}