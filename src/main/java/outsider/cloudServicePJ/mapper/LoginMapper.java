package outsider.cloudServicePJ.mapper;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.LoginVO;

@Mapper
public interface LoginMapper {
    public LoginVO LoginFunction(Map<String, Object> data);
}