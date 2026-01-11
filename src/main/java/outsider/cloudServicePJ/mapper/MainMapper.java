package outsider.cloudServicePJ.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.FileManageVO;

@Mapper
public interface MainMapper {
    public void fileUploadData(FileManageVO data);
}
