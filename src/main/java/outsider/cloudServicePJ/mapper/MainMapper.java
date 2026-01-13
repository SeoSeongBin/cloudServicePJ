package outsider.cloudServicePJ.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import outsider.cloudServicePJ.VO.FileManageVO;

@Mapper
public interface MainMapper {
    public void fileUploadData(FileManageVO data);
    public FileManageVO fileData(FileManageVO data);
    List<FileManageVO> fileListData(FileManageVO data);
    public void fileDelteData(FileManageVO data);
}
