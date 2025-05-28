package outsider.cloudServicePJ.mapper;
import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.SignUpVO;

@Mapper
public interface signUpMapper {
    public void signUpAuthInsert(SignUpVO data);
    public void signUpAuthUpdate(SignUpVO data);
}