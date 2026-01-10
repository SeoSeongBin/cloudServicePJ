import react, {useState, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faUpload, faTrashCan, faFileZipper, faTimes, faFile, faCirclePause, faArrowUpFromBracket,faFileCode,faFileImage, faFilePdf,faFilePowerpoint,faFileCsv,faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

export default function Content() {
    let [uploadShowHide, uploadShowHideStat] = useState(false);
    let [chkStatus, chkstatus] = useState(false);
    let [uploadQueue, setUploadQueue] = useState([]);
    let fileInputRef = useRef(null);

    let toggleAllSelect = () => {
        chkstatus(!chkStatus);
    };

    let toggleUploadPopShowHide = () => {
        uploadShowHideStat(!uploadShowHide);
    };

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

    const newFolder = () => {

    }
    
    return(
        <div id="contents">
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
                <div className="btn file_new_folder_btn" onClick={newFolder}>새 폴더</div>
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
                {/* <div className="file"></div> */}
            </div>
        </div>
    )
}