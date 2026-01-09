import react, {useState, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faUpload, faTrashCan, faFileAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

export default function Content() {
    let [chkStatus, chkstatus] = useState(false);
    let [uploadQueue, setUploadQueue] = useState([]);
    let fileInputRef = useRef(null);

    let toggleAllSelect = () => {
        chkstatus(!chkStatus);
    };

    // 파일 선택창 열기
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // 파일 선택 시 대기열에 추가
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadQueue((prev) => [...prev, ...files]);
        e.target.value = '';
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
                    <h2 className="content_tit">My Cloude</h2>
                </div>
                <div className="content_header_right">
                    
                </div>
            </div>
            
            <div className="content_btn_area">
                <div className={`btn all_chk_btn ${chkStatus ? "on" : ""}`} onClick={toggleAllSelect}>전체선택 <FontAwesomeIcon icon={chkStatus ? faSquareCheck : faSquare} /></div>
                <div className="btn file_upload_btn" onClick={handleUploadClick}>업로드 <FontAwesomeIcon icon={faUpload} /></div>
                <div className="btn file_delete_btn"><FontAwesomeIcon icon={faTrashCan} /></div>
            </div>

            {uploadQueue != null && (
                <div className="upload_waiting_area">
                    <div className="waiting_header">
                        <span>업로드 대기 중인 파일 <strong>{uploadQueue.length}</strong>개</span>
                        <button className="start_upload_btn" onClick={startUpload}>전송 시작</button>
                    </div>
                    <ul className="waiting_list">
                        {uploadQueue.map((file, idx) => (
                            <li key={idx}>
                                <FontAwesomeIcon icon={faFileAlt} className="file_icon" />
                                <span className="file_name">{file.name}</span>
                                <FontAwesomeIcon 
                                    icon={faTimes} 
                                    className="remove_icon" 
                                    onClick={() => removeFile(idx)} 
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="file_wrap">
                {/* <div className="file"></div> */}
            </div>
        </div>
    )
}