import react, {useEffect,useState, useRef} from "react";
import { useNavigate } from "react-router-dom"; // 상단에 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faUpload, faTrashCan, faFileZipper, faTimes, faFile, faCirclePause, faArrowUpFromBracket,faFileCode,faFileImage, faFilePdf,faFilePowerpoint,faFileCsv,faFileWord, faFolder, faSpinner,faCheckCircle, faDownload, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { useStorage } from './StorageContext';
import axios from "axios"; 

export default function Content() {
    const navigate = useNavigate();
    // 업로드 팝업 show(true), hide(false) 처리를 위한 상태값
    let [uploadShowHide, uploadShowHideStat] = useState(false);
    // 전체선택 유무확인
    let [chkStatus, chkstatus] = useState(false);
    // 파일 업로드 대기열
    let [uploadQueue, setUploadQueue] = useState([]);

    let [newNamePop, newNamePopSata] = useState(false);
    // 이름 팝업창 종류(false:새폴더, true:이름변경)
    let [namePopType, newnamePopType] = useState(false);

    let fileInputRef = useRef(null);
    // 이름 팝업창 타이틀(새폴더, 이름변경)
    let [namePopTit, setNamePopTit] = useState("");
    // 변경할 내용 적혀져있는 파일 이름
    let [fileName, setFileName] = useState('');
    // 현재 디렉토리 파일 리스트
    let [itemList, setItemList] = useState([]);
    // 업로드 완료된 파일 개수를 관리할 상태
    let [completedCount, setCompletedCount] = useState(0);
    // 개별 파일의 상태를 관리 (예: { 0: 'success', 1: 'uploading' })
    let [uploadStatus, setUploadStatus] = useState({});
    // 업로드 진행상태
    let [progress, setProgress] = useState(0);
    // 선택된 파일들의 ID 배열
    let [selectedIds, setSelectedIds] = useState([]);
    // 더블클릭한 파일 ID
    let [dbClickFileId, setDbFileId] = useState('');
    // 최상위 폴더 ID
    let [topFileId, settopFileId] = useState('0');
    // 현재 디렉토리 ID
    let [nowFileId, setNowFileId] = useState('0');
    // 이전 디렉토리 ID
    let [backFileId, setBackFileId] = useState('');
    
    // 컴포넌트 내부 상태 선언부
    const [loadedBytes, setLoadedBytes] = useState({}); // 각 파일별 전송된 바이트 { index: size }
    // 전체 용량 계산
    const totalSize = uploadQueue.reduce((acc, file) => acc + file.size, 0);
    // 현재까지 전송된 총 용량 계산
    const currentLoadedTotal = Object.values(loadedBytes).reduce((acc, byte) => acc + byte, 0);
    // 전체 진행 퍼센트
    const totalProgress = totalSize > 0 ? Math.floor((currentLoadedTotal / totalSize) * 100) : 0;
    // 완료된 파일 개수 (실제 완료된 시점에 카운트)
    const finishedCount = Object.values(uploadStatus).filter(status => status === 'success').length;

    const { fetchStorage } = useStorage(); // StorageContext에서 가져오기

let toggleAllSelect = () => {
    // 1. 상태를 미리 반전시켜서 변수에 담습니다 (비동기 문제 방지)
    const nextStatus = !chkStatus; 
    chkstatus(nextStatus);

    if (nextStatus) {
        // [전체 선택]
        // filter로 -1이 아닌 항목만 먼저 거른 뒤, 그 데이터들의 fm_ID만 추출합니다.
        const allIds = itemList
            .filter(item => item.fm_ID !== -1) // fm_ID가 -1인 '뒤로가기' 제외
            .map(item => item.fm_ID);
            
        setSelectedIds(allIds);
    } else {
        // [전체 해제]
        // 빈 배열을 넣어 아무것도 선택되지 않은 상태로 만듭니다.
        setSelectedIds([]);
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
        formData.append('parentId', nowFileId);
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
                        fileListFunction(nowFileId);

                        fetchStorage();
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

        setUploadStatus({}); // 상태 초기화
        setLoadedBytes({});  // 진행도 초기화

        // 파일별로 순차적(또는 병렬) 업로드 루프
        for (let i = 0; i < uploadQueue.length; i++) {
            const file = uploadQueue[i];
            const formData = new FormData();
            formData.append('files', file);
            formData.append('parentId', nowFileId);

            // 해당 파일 업로드 시작 상태 표시
            setUploadStatus(prev => ({ ...prev, [i]: "uploading" }));

            try {
                const res = await axios.post('/api/upload', formData, {
                    onUploadProgress: (progressEvent) => {
                        // 실시간 진행 바이트 업데이트
                        setLoadedBytes(prev => ({
                            ...prev,
                            [i]: progressEvent.loaded
                        }));
                    }
                });

                if (res.data.status === "success") {
                    setUploadStatus(prev => ({ ...prev, [i]: "success" }));
                } else {
                    setUploadStatus(prev => ({ ...prev, [i]: "idle" }));
                }
            } catch (err) {
                console.error("업로드 에러", err);
                setUploadStatus(prev => ({ ...prev, [i]: "idle" }));
            }
        }

        // 모든 루프 종료 후 리스트 새로고침
        fileListFunction(nowFileId);

        fetchStorage();
        // 선택 사항: 완료 후 대기열 비우기
        // setUploadQueue([]);
    };

    const namePopSaveBtn = () => {
        if (namePopType === false) { // 새 폴더 생성 모드
            if (fileName.trim() === "") {
                alert("이름을 입력해주세요.");
                return;
            }

            fetch('/api/newFolder', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: fileName,
                    parentId: nowFileId // 현재 보고 있는 폴더 ID 전송
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    // 1. 성공 시에만 리스트를 새로고침합니다.
                    // 중요: nowFileId를 직접 넘겨서 최신 리스트를 가져오게 합니다.
                    fileListFunction(nowFileId);
                    
                    // 2. 처리가 끝나면 입력창을 비우고 팝업을 닫습니다.
                    setFileName('');
                    newNamePopSata(false);
                } else {
                    alert("폴더 생성 실패: " + data.message);
                }
            })
            .catch((err) => {
                console.error("에러 발생:", err);
                alert("서버 통신 중 오류가 발생했습니다.");
            });
        } else {
            // 이름 바꾸기 로직 (생략)
        }
    };

    // 파일 리스트 불러오는 로직
    const fileListFunction= async (fileId) => {
        try {
            await fetch('/api/fileList', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    upId:fileId 
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success" && data.list) {
                    let fileList = [...data.list];

                    // 서버에서 받은 list를 상태에 저장
                    if(fileId != 0){
                        const backButton = {
                            fm_ID: -1, // 서버에서 넘겨준 부모 폴더 ID (필요에 따라 조정)
                            fm_FILE_NAME: "뒤로가기",
                            fm_FILE_TYPE: "B",
                            fm_FILE_EXTENSION_TYPE: "back"
                        };
                        fileList = [backButton, ...fileList];
                    }
                    setItemList(fileList); 
                }
            })
        }catch{

        }
    }

    // 파일 다운로드
    const fileDownFunction = async () => {
        if (selectedIds.length === 0) {
            alert("다운로드할 파일을 선택해주세요.");
            return;
        }

        for (let id of selectedIds) {
            try {
                const response = await fetch('/api/fileDown', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileId: id
                    })
                });

                // 1️⃣ Content-Type 확인
                const contentType = response.headers.get("Content-Type") || "";

                // 2️⃣ JSON 응답이면 → 다운로드 중단
                if (contentType.includes("application/json")) {
                    const json = await response.json();

                    switch (json.status) {
                        case "file_not_exists":
                            alert("파일이 존재하지 않습니다.");
                            break;
                        case "null":
                            alert("로그인이 필요합니다.");
                            break;
                        case "not_found":
                            alert("파일 정보가 없습니다.");
                            break;
                        case "fail":
                            alert("잘못된 요청입니다.");
                            break;
                        default:
                            alert("다운로드 중 오류가 발생했습니다.");
                    }
                    continue; // 다음 파일 처리
                }

                // 3️⃣ 파일 응답일 때만 Blob 처리
                const blob = await response.blob();

                // 4️⃣ 파일명 추출
                const contentDisposition = response.headers.get('Content-Disposition');
                let fileName = `file_${id}`;

                if (contentDisposition && contentDisposition.includes('filename=')) {
                    fileName = decodeURIComponent(
                        contentDisposition
                            .split('filename=')[1]
                            .replace(/"/g, '')
                    );
                }

                // 5️⃣ 다운로드 실행
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;

                document.body.appendChild(a);
                a.click();

                // 6️⃣ 정리
                a.remove();
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error("다운로드 중 오류 발생:", error);
                alert("파일 다운로드 중 오류가 발생했습니다.");
            }
        }
    };

    // 리스트 목록 더블클릭 했을때 작동하는 로직
    const fileDbClickFunction = async (folderId) => {
        try {
            const res = await fetch('/api/fileTypeChk', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileId: folderId // 직접 받은 ID 사용
                })
            });
            
            const data = await res.json();

            if (data.status === "success") {
                // 파일의 타입이 폴더(type : D)일 경우에만 작동
                if (data.fileType === "D") {
                    // 선택한 파일 ID 세팅
                    setNowFileId(data.fileId);

                    // 선택한 폴더의 상위폴더ID 세팅
                    setBackFileId(data.upFileId);

                    // 폴더 진입 시 선택되어있던 리스트 초기화
                    setSelectedIds([]);

                    // 선택한 폴더의 리스트 세로 세팅 
                    fileListFunction(data.fileId);

                }
            }
        } catch (err) {
            console.error("폴더 진입 오류:", err);
        }
    }

    // 이걸 선택할 경우 상위 폴더로 이동
    const backFolderList = async () => {
        if(backFileId == "0"){
            fileListFunction(backFileId);
            settopFileId("0");
            setNowFileId("0");
            setBackFileId("");
            setSelectedIds([]);
        }else{
            try {
                const res = await fetch('/api/fileTypeChk', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileId: backFileId // 직접 받은 ID 사용
                    })
                });
                
                const data = await res.json();
    
                if (data.status === "success") {
                        // 파일의 타입이 폴더(type : D)일 경우에만 작동
                        if (data.fileType === "D") {
                            // 선택한 파일 ID 세팅
                            setNowFileId(data.fileId);
                            // 선택한 폴더의 상위폴더ID 세팅
                            setBackFileId(data.upFileId);
                            // 폴더 진입 시 선택되어있던 리스트 초기화
                            setSelectedIds([]);
        
                            // 선택한 폴더의 리스트 세로 세팅 
                            fileListFunction(data.fileId);
                        }
                }
            } catch (err) {
                console.error("폴더 진입 오류:", err);
            }
        }
    }



    useEffect(() =>{
        fileListFunction(nowFileId);
    }, []);

    // 파일 클릭 시 선택/해제 토글 함수
    const handleFileClick = (id) => {
        // 마지막으로 클릭한 파일 id 를 변수로 세팅
        setDbFileId(id);

        if(topFileId === "0"){
            settopFileId(id);
        }

        if(id !== -1){
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
        }else{
            backFolderList();
        }
    };

    useEffect(() => {
        // 뒤로가기(-1)를 제외한 실제 선택 가능한 아이템들만 필터링
        const actualItems = itemList.filter(item => item.fm_ID !== -1);

        // 실제 아이템이 존재하고, 
        // 선택된 ID의 개수가 실제 아이템의 개수와 일치하는지 확인
        if (actualItems.length > 0 && selectedIds.length === actualItems.length) {
            chkstatus(true);
        } else {
            chkstatus(false);
        }
    }, [selectedIds, itemList]);
    
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
                <div className={`btn ${selectedIds.length === 0 ? "dn" : ""}`} onClick={fileDownFunction}>다운로드 <FontAwesomeIcon icon={faDownload} /></div>
                <div className={`btn file_delete_btn ${selectedIds.length === 0 ? "dn" : ""}`} onClick={removeFile}><FontAwesomeIcon icon={faTrashCan} /></div>
            </div>

            <div class="upload_show_btn" onClick={toggleUploadPopShowHide}>
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </div>

            <div className={`upload_waiting_area ${uploadShowHide ? "" : "dn"}`}>
                <div className="waiting_header">
                    <h2>
                        업로드 
                        <span>
                            ( {finishedCount} / {uploadQueue.length} 개 완료 - {totalProgress}% )
                        </span> 
                        <i className="close_btn" onClick={toggleUploadPopShowHide}>
                            <FontAwesomeIcon icon={faTimes} />
                        </i>
                    </h2>
                    <div className="waiting_file_progress_bar">
                        {/* 전체 용량 대비 실제 전송량(Byte) 기반 프로그레스 바 */}
                        <div 
                            className="waiting_file_gager" 
                            style={{ 
                                width: `${totalProgress}%`, 
                                transition: 'width 0.2s linear',
                                backgroundColor: '#007bff'
                            }}
                        ></div>
                    </div>
                    <div className="waiting_size_info" style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                        {(currentLoadedTotal / (1024 * 1024)).toFixed(2)} MB / {(totalSize / (1024 * 1024)).toFixed(2)} MB 전송 중
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

                        // 개별 파일의 진행률 계산 (필요 시 개별 바 표시용)
                        const fileLoaded = loadedBytes[index] || 0;
                        const filePercent = Math.floor((fileLoaded / file.size) * 100);

                        return (
                            <div className={`waiting_file ${uploadStatus[index] === 'success' ? 'finished' : ''}`} key={index}>
                                <div className="file_icon">
                                    <FontAwesomeIcon icon={fileIcon} />
                                </div>
                                <div className="file_info">
                                    <p className="file_name" title={file.name}>{file.name}</p>
                                    <p className="file_size">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        {uploadStatus[index] === "uploading" && ` (${filePercent}%)`}
                                    </p>
                                </div>
                                <div className="waiting_file_status">
                                    {/* 개별 파일 상태(uploadStatus[index])에 따른 아이콘 분기 */}
                                    {(!uploadStatus[index] || uploadStatus[index] === "idle") && <FontAwesomeIcon icon={faCirclePause} />}
                                    {uploadStatus[index] === "uploading" && <FontAwesomeIcon icon={faSpinner} spin color="#007bff" />}
                                    {uploadStatus[index] === "success" && <FontAwesomeIcon icon={faCheckCircle} color="#28a745" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="upload_waiting_btn_area">
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
                        if (fileExt === 'back') fileIcon = faEllipsis;
                    }

                    // 선택 여부 확인
                    let isSelected = selectedIds.includes(item.fm_ID);
                    
                    return (
                        <div className={`file ${isSelected ? "on" : ""}`} fileType={fileExt} key={item.fm_ID} onClick={() => handleFileClick(item.fm_ID)} onDoubleClick={() => fileDbClickFunction(item.fm_ID)}>
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