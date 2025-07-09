import { useEffect } from 'react';
import './modal.css';

//모달 컴포넌트 
export default function Modal(props){
    const isOpen = props.isOpen; 
    const onClose = props.onClose;
    const children = props.children;
    const modalType = props.modalType;

    //Modal 열릴때, 스크롤 막기
    useEffect(function(){
        if(isOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]); //의존성배열 추가, isOpen 값이 바뀔때마다 실행

    if(!isOpen){
        return null;    //열려 있지 않으면 랜더링 X
    }   
    return (
        <div className='modal-overlay'>
            <div className='modal-wrap'>
                <div className='modal-header'>
                    <h2>{modalType == 'charge' ? '충전하기': '출금하기'}</h2>
                    {/* onClose: 부모컴포넌트로 받은 함수(== 모달창 닫기) */}
                    <div className='modal-close' onClick={onClose}>x</div> 
                </div>
                <div className='modal-content'>
                    {children}
                </div>
            </div>
        </div>
    )
}