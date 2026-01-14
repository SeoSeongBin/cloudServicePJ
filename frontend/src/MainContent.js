import react, {useEffect,useState, useRef} from "react";
import { useNavigate } from "react-router-dom"; // 상단에 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faUpload, faTrashCan, faFileZipper, faTimes, faFile, faCirclePause, faArrowUpFromBracket,faFileCode,faFileImage, faFilePdf,faFilePowerpoint,faFileCsv,faFileWord, faFolder, faSpinner,faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

export default function Content() {
    const navigate = useNavigate();
    let [uploadShowHide, uploadShowHideStat] = useState(false);
    let [chkStatus, chkstatus] = useState(false);
    let [uploadQueue, setUploadQueue] = useState([]);
    let [newNamePop, newNamePopSata] = useState(false);
    let [namePopType, newnamePopType] = useState(false);
    let fileInputRef = useRef(null);
    let [namePopTit, setNamePopTit] = useState("");
    let [fileName, setFileName] = useState('');
    let [itemList, setItemList] = useState([]);
    // 업로드 완료된 파일 개수를 관리할 상태
    let [completedCount, setCompletedCount] = useState(0);
    // 개별 파일의 상태를 관리 (예: { 0: 'success', 1: 'uploading' })
    let [uploadStatus, setUploadStatus] = useState({});
    // 업로드 진행상태
    let [progress, setProgress] = useState(0);
    // 선택된 파일들의 ID 배열
    let [selectedIds, setSelectedIds] = useState([]);
    // 선택된 파일 유무 확인용
    let isAnySelected = selectedIds.length > 0;

    let toggleAllSelect = () => {
        chkstatus(!chkStatus);

        if(chkStatus === true){

        }
    };

    // 새폴더
    let toggleNamePop = () => {
        newNamePopSata(!newNamePop);
        setNamePopTit("새 폴더");
        newnamePopType(false);
    }
    // 이름바꾸기
    let toggleNamePop2 = () => {
        newNamePopSata(!newNamePop);
        setNamePopTit("이름 바꾸기");
        newnamePopType(true);
    }

    let toggleUploadPopShowHide = () => {
        uploadShowHideStat(!uploadShowHide);
    };

    // 파일명 input 변경시 마다 적용
    let fileNameChange = (e) => {
        setFileName(e.target.value);
    }

    // 파일 선택창 열기
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };


    // 드래그 이벤트 핸들러 추가
    const handleDragOver = (e) => {
        // 브라우저가 파일을 여는 것을 방지
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 드롭된 파일들 가져오기
        const files = Array.from(e.dataTransfer.files);

        if (files.length > 0) {
            // 기존 파일 추가 로직 재사용
            setUploadQueue((prev) => [...prev, ...files]);
            uploadShowHideStat(true); // 대기열 창 열기
        }
    };

    // 파일 선택 시 대기열에 추가
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if(files.length != 0){
            uploadShowHideStat(true);
            setUploadQueue((prev) => [...prev, ...files]);
        }
        e.target.value = '';
    };

    // 파일 확장자 보기
    const getFileExtension = (filename) => {
        // 파일명에서 마지막 '.'의 위치를 찾음
        const lastDot = filename.lastIndexOf('.');
        // '.'이 없거나 파일명이 '.'으로 시작하는 경우 예외 처리
        if (lastDot === -1) return '파일'; 
        // '.' 뒷부분을 추출하여 소문자로 변환 (예: .JPG -> jpg)
        return filename.substring(lastDot + 1).toLowerCase();
    };

    // 파일 삭제
    const removeFile = async () => {
        const formData = new FormData();
        selectedIds.forEach(id => formData.append('files', id));
        // formData.append('parentId', 0);
        // console.log(selectedIds.length);

        // 선택된 파일이 없을경우
        if(selectedIds.length === 0){
            alert("파일을 선택해주세요");
        }else{
            try {
                const res = await fetch('/api/fileDelete', {
                    method: 'POST',
                    body: formData
                });
                if (res.ok) {
                    // 2. 서버가 보낸 Map(JSON) 데이터를 파싱
                    const data = await res.json();
                    // 3. 서버가 담아준 status 값이 "success"인지 확인
                    if (data.status === "success") {
                        alert("삭제가 완료되었습니다.");
                        setSelectedIds([]);
                        fileListFunction();
                    }else if(data.status === "null"){
                        alert("로그인이 끊어졌습니다.");
                        navigate("/login");
                    }
                    else {
                        // 서버에서 result.put("status", "error")를 보낸 경우
                        console.error("Server Logic Error:", data.message);
                        alert("서버 오류: " + data.message);
                        setUploadStatus("idle");
                    }
                }
            }catch(err){
                // 네트워크 연결 오류 등 아예 서버에 닿지 못한 경우
                console.error("Network Error:", err);
                alert("네트워크 오류가 발생했습니다.");
            }

        }
    };

    // 서버 전송
    const startUpload = async () => {
        if (uploadQueue.length === 0) return;

        const formData = new FormData();
        uploadQueue.forEach(file => formData.append('files', file));
        formData.append('parentId', 0);

        setUploadStatus("uploading");

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            // 1. 우선 HTTP 응답 자체가 성공(200 OK)인지 확인
            if (res.ok) {
                // 2. 서버가 보낸 Map(JSON) 데이터를 파싱
                const data = await res.json(); 

                // 3. 서버가 담아준 status 값이 "success"인지 확인
                if (data.status === "success") {
                    setUploadStatus("success");
                    setProgress(100);
                    setTimeout(() => {
                        alert("업로드 완료!");
                        setUploadQueue([]);
                        setUploadStatus("idle");
                    }, 1000);

                    fileListFunction();
                } else {
                    // 서버에서 result.put("status", "error")를 보낸 경우
                    console.error("Server Logic Error:", data.message);
                    alert("서버 오류: " + data.message);
                    setUploadStatus("idle");
                }
            } else {
                // HTTP 상태 코드가 400, 500번대인 경우
                alert("업로드 실패 (HTTP 에러)");
                setUploadStatus("idle");
            }
        } catch (err) {
            // 네트워크 연결 오류 등 아예 서버에 닿지 못한 경우
            console.error("Network Error:", err);
            alert("네트워크 오류가 발생했습니다.");
            setUploadStatus("idle");
        }
    };

    const namePopSaveBtn = () => {
        if(namePopType == false){
            if (fileName.trim() === "") {
                alert("이름을 입력해주세요.");
                return;
            }
            // 고유 ID (삭제나 수정 시 필요)
            // const newItem = {
            //     id: Date.now(), 
            //     name: fileName,
            //     type: 'folder'
            // };

            
            fetch('/api/newFolder', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName:fileName 
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success" && data.list) {
                    // 서버에서 받은 list를 상태에 저장
                    setItemList(data.list); 
                }
            })
            // setItemList((prev) => [...prev, newItem]);
            

        }else{

        }

                    // 입력창 비우고 팝업 닫기
            setFileName('');
            newNamePopSata(false);

            fileListFunction();
    }

    // 파일 리스트 불러오는 로직
    const fileListFunction=() => {
        try {
            fetch('/api/fileList', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    upId:"0" 
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success" && data.list) {
                    // 서버에서 받은 list를 상태에 저장
                    setItemList(data.list); 
                }
            })
        }catch{

        }
    }


    useEffect(() =>{
        fileListFunction();
    }, []);

    // 파일 클릭 시 선택/해제 토글 함수
    const handleFileClick = (id) => {
        // selectFileStat(!selectFile);
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                // 이미 선택되어 있다면 제거
                return prev.filter(selectedId => selectedId !== id);
            } else {
                // 선택되어 있지 않다면 추가
                return [...prev, id];
            }
        });
    };
    
    return(
        <div id="contents">

            <div className={`name_popup_wrap ${newNamePop ? "" : "dn"}`}>
                <div className="pop_bac"></div>
                <div className="name_pop_content">
                    <h3>{namePopTit} <FontAwesomeIcon icon={faTimes} onClick={toggleNamePop} /></h3>
                    <input className="file_name_input" type="text" placeholder="이름을 입력해주세요" onChange={fileNameChange} value={fileName} />
                    <div className="name_pop_btn_area">
                        <div className="save_btn" onClick={namePopSaveBtn}>확인</div>
                        <div className="close_btn" onClick={toggleNamePop}>닫기</div>
                    </div>
                </div>
            </div>

            <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />
            <div className="content_header">
                <div className="content_header_left">
                    <h2 className="content_tit">My Cloud</h2>
                </div>
                <div className="content_header_right">
                    
                </div>
            </div>
            
            <div className="content_btn_area">
                <div className={`btn all_chk_btn ${chkStatus ? "on" : ""}`} onClick={toggleAllSelect}>전체선택 <FontAwesomeIcon icon={chkStatus ? faSquareCheck : faSquare} /></div>
                <div className="btn file_new_folder_btn" onClick={toggleNamePop}>새 폴더</div>
                <div className="btn file_upload_btn" onClick={handleUploadClick}>업로드 <FontAwesomeIcon icon={faUpload} /></div>
                <div className={`btn ${selectedIds.length === 0 ? "dn" : ""}`}>다운로드 <FontAwesomeIcon icon={faDownload} /></div>
                <div className={`btn file_delete_btn ${selectedIds.length === 0 ? "dn" : ""}`} onClick={removeFile}><FontAwesomeIcon icon={faTrashCan} /></div>
            </div>

            <div class="upload_show_btn" onClick={toggleUploadPopShowHide}>
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </div>

                <div className={`upload_waiting_area ${uploadShowHide ? "" : "dn"}`}>
                    <div className="waiting_header">
                        {/* 완료된 파일 숫자는 나중에 상태값으로 관리하면 좋습니다 (현재는 0으로 표시) */}
                        <h2>
                            업로드 <span>( 0 / {uploadQueue.length} 개 완료 )</span> 
                            <i className="close_btn" onClick={toggleUploadPopShowHide}>
                                <FontAwesomeIcon icon={faTimes} />
                            </i>
                        </h2>
                        <div className="waiting_file_progress_bar">
                            <div className="waiting_file_gager" style={{ width: '0%' }}></div>
                        </div>
                    </div>

                <div className="waiting_list">
                {uploadQueue.map((file, index) => {
                    const fileExt = file.name.split('.').pop().toLowerCase();
                    let fileIcon = faFile;
                    if (['css','jsp','html','java','js','xml'].includes(fileExt)) fileIcon = faFileCode;
                    if (['jpg', 'png', 'gif', 'jpeg'].includes(fileExt)) fileIcon = faFileImage;
                    if (fileExt === 'pdf') fileIcon = faFilePdf;
                    if (fileExt === 'zip') fileIcon = faFileZipper;
                    if (['ppt','pptx'].includes(fileExt)) fileIcon = faFilePowerpoint;
                    if (fileExt === 'csv') fileIcon = faFileCsv;
                    if (['doc','docx'].includes(fileExt)) fileIcon = faFileWord;

                    return (
                        <div className={`waiting_file ${uploadStatus === 'success' ? 'finished' : ''}`} key={index}>
                            <div className="file_icon">
                                <FontAwesomeIcon icon={fileIcon} />
                            </div>
                            <div className="file_info">
                                <p className="file_name" title={file.name}>{file.name}</p>
                                <p className="file_size">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <div className="waiting_file_status">
                                {/* 상태값(uploadStatus)에 따라 아이콘을 분기 처리 */}
                                {uploadStatus === "idle" && <FontAwesomeIcon icon={faCirclePause} />}
                                {uploadStatus === "uploading" && <FontAwesomeIcon icon={faSpinner} spin color="#007bff" />}
                                {uploadStatus === "success" && <FontAwesomeIcon icon={faCheckCircle} color="#28a745" />}
                            </div>
                        </div>
                    );
                })}
                </div>
                    <div className="upload_waiting_btn_area">
                        {/* 이전에 만든 startUpload 함수를 여기에 연결하세요 */}
                        <div className="btn start_upload_btn" onClick={startUpload}>시작</div>
                        <div className="btn stop_upload_btn">일시정지</div>
                    </div>
                </div>
                
            <div className="file_wrap"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
            {itemList.map((item) => {
                    // 1. 확장자 추출 (DB에 저장된 fm_FILE_EXTENSION_TYPE 사용)
                    // 값이 없을 경우를 대비해 기본값 '' 처리
                    const fileExt = (item.fm_FILE_EXTENSION_TYPE || '').toLowerCase();
                    const fileType = item.fm_FILE_TYPE; // 'D'일 경우 폴더로 처리하기 위함

                    // 2. 아이콘 결정 로직 (업로드 대기열과 동일)
                    let fileIcon = faFile; // 기본 아이콘

                    if (fileType === 'D') {
                        fileIcon = faFolder; // 폴더 타입일 경우
                    } else {
                        if (['css','jsp','html','java','js','xml'].includes(fileExt)) fileIcon = faFileCode;
                        if (['jpg', 'png', 'gif', 'jpeg'].includes(fileExt)) fileIcon = faFileImage;
                        if (fileExt === 'pdf') fileIcon = faFilePdf;
                        if (fileExt === 'zip') fileIcon = faFileZipper;
                        if (['ppt','pptx'].includes(fileExt)) fileIcon = faFilePowerpoint;
                        if (fileExt === 'csv') fileIcon = faFileCsv;
                        if (['doc','docx'].includes(fileExt)) fileIcon = faFileWord;
                    }

                    // 선택 여부 확인
                    let isSelected = selectedIds.includes(item.fm_ID);
                    
                    return (
                        <div className={`file ${isSelected ? "on" : ""}`} key={item.fm_ID} onClick={() => handleFileClick(item.fm_ID)}>
                            <div className="file_icon">
                                {/* 결정된 아이콘 적용 및 폴더/파일 색상 구분(선택사항) */}
                                <FontAwesomeIcon 
                                    icon={fileIcon} 
                                    style={{ color: fileType === 'D' ? '#FFCA28' : '#6c757d' }} 
                                />
                            </div>
                            <span className="file_name" title={item.fm_FILE_NAME}>
                                {item.fm_FILE_NAME}
                            </span>
                        </div>
                    );
                })}
            </div>
            
        </div>
    )
}