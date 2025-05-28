package outsider.cloudServicePJ.mapper;
import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.LoginVO;

@Mapper
public interface LoginMapper {
    public LoginVO LoginFunction(String id, String pw);
}