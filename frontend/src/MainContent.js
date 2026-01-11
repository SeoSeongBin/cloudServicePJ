import react, {useState, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faUpload, faTrashCan, faFileZipper, faTimes, faFile, faCirclePause, faArrowUpFromBracket,faFileCode,faFileImage, faFilePdf,faFilePowerpoint,faFileCsv,faFileWord, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

export default function Content() {
    let [uploadShowHide, uploadShowHideStat] = useState(false);
    let [chkStatus, chkstatus] = useState(false);
    let [uploadQueue, setUploadQueue] = useState([]);
    let [newNamePop, newNamePopSata] = useState(false);
    let fileInputRef = useRef(null);
    let [namePopTit, setNamePopTit] = useState("");
    let [fileName, setFileName] = useState('');
    let [itemList, setItemList] = useState([]);

    let toggleAllSelect = () => {
        chkstatus(!chkStatus);

        if(chkStatus === true){

        }
    };

    // 새폴더
    let toggleNamePop = () => {
        newNamePopSata(!newNamePop);
        setNamePopTit("새 폴더");
    }
    // 이름바꾸기
    let toggleNamePop2 = () => {
        newNamePopSata(!newNamePop);
        setNamePopTit("이름 바꾸기");
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

    // 대기열 삭제
    const removeFile = (index) => {
        setUploadQueue((prev) => prev.filter((_, i) => i !== index));
    };

    // 서버 전송
    const startUpload = async () => {
        if (uploadQueue.length === 0) return;

        const formData = new FormData();
        uploadQueue.forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                alert("업로드 완료!");
                setUploadQueue([]); // 대기열 비우기
            }
        } catch (err) {
            console.error("업로드 실패", err);
        }
    };

    const namePopSaveBtn = () => {
        if(namePopTit == "새 폴더"){
            if (fileName.trim() === "") {
                alert("이름을 입력해주세요.");
                return;
            }
            // 고유 ID (삭제나 수정 시 필요)
            const newItem = {
                id: Date.now(), 
                name: fileName,
                type: 'folder'
            };

            setItemList((prev) => [...prev, newItem]);
            
            // 입력창 비우고 팝업 닫기
            setFileName('');
            newNamePopSata(false);
        }else{

        }
    }
    
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
                <div className="btn file_delete_btn"><FontAwesomeIcon icon={faTrashCan} /></div>
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
                        // 파일명에서 확장자만 추출 (마지막 점 뒤의 문자열)
                        const fileExt = file.name.split('.').pop().toLowerCase();

                        // 확장자별 아이콘 결정
                        // 기본확장자
                        let fileIcon = faFile; 
                        if (['css','jsp','html','java','js','xml'].includes(fileExt)) fileIcon = faFileCode; // CSS용 (Solid 아이콘 추가 필요)
                        if (['jpg', 'png', 'gif'].includes(fileExt)) fileIcon = faFileImage;
                        if (fileExt === '.pdf') fileIcon = faFilePdf;
                        if (fileExt === '.zip') fileIcon = faFileZipper;
                        if (['ppt','pptx'].includes(fileExt)) fileIcon=faFilePowerpoint;
                        if (fileExt === '.csv') fileIcon = faFileCsv;
                        if (['doc','docx'].includes(fileExt)) fileIcon = faFileWord;


                        return (
                            <div className="waiting_file" key={index}>
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
                                    <FontAwesomeIcon icon={faCirclePause} />
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
                {itemList.map((item) => (
                    <div className="file" key={item.id}>
                        {/* 아이콘과 이름을 렌더링 */}
                        <FontAwesomeIcon icon={faFolder} />
                        <span className="file_name">{item.name}</span>
                    </div>
                ))}
            </div>
            
        </div>
    )
}