package outsider.cloudServicePJ.mapper;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.SignUpVO;

@Mapper
public interface signUpMapper {
    public Integer userInfoCnt(String id);
    public Integer authInfoCnt(Map<String, Object> data);
    public void signUpAuthInsert(Map<String, Object> data);
    public void signUpAuthUpdate(Map<String, Object> data);
}