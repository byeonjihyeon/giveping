import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import createInstance from '../axios/Interceptor';


/*
isLogined : 로그인 여부 (true == 로그인 된 상태, false == 로그아웃 상태)
setIsLogined : 로그인 상태 변경 시, 호출 함수
loginMember : 로그인 회원 정보(개인)
setLoginMember : 로그인 회원 정보 변경 시, 호출 함수
loginOrg : 로그인 회원 정보(단체)
setLoginOrg : 로그인 회원 정보 변경 시, 호출 함수
accessToken : 로그인 이후, 요청시마다 헤더에 포함될 토큰
setAccessToken : acceeToken 변경 시, 호출 함수
refreshToken : accessToken 만료 시, 재발급 할 때 필요한 토큰
setRefreshToken : refreshToken 변경 시, 호출 함수

hasNewAlert : 새로운 알람이 있는지 없는지 true / false 로 구분하는 변수
setHasNewAlert : 
unreadAlarmCount : 안 읽은 알람 수 세는 변수
setUnreadAlarmCount : 
fetchUnreadAlarmCount : 소식 읽음 처리 할 때마다, badge를 update 하기 위해 호출되는 함수
*/

// fetchUnreadAlarmCount (알람 수 세는 함수) 를 위한 변수 선언
const serverUrl = import.meta.env.VITE_BACK_SERVER;
const axiosInstance = createInstance();

const useUserStore = create(
    persist (
        (set, get) => ({
            isLogined : false,
            setIsLogined : function(loginChk){
                set({
                    isLogined : loginChk
                })
            },
            loginMember : null,
            setLoginMember : function(memberObj){
                set({
                    loginMember : memberObj
                })
            },
            loginOrg : null, 
            setLoginOrg : function(orgObj){
                set({
                    loginOrg : orgObj
                })
            },
            accessToken : null,
            setAccessToken : function(accessToken){
                set({
                    accessToken : accessToken
                })
            },
            refreshToken : null,
            setRefreshToken : function(refreshToken){
                set({
                    refreshToken : refreshToken
                })
                },
            unreadAlarmCount : 0,
            setUnreadAlarmCount : function(count){
                set({
                    unreadAlarmCount : count
                })
            }
            ,
            hasNewAlert : false,
            setHasNewAlert : function(hasNewAlert){
                set({
                    hasNewAlert : hasNewAlert
                })
            },

            fetchUnreadAlarmCount: async function () {
            const { loginMember, loginOrg } = get();
            let options = {
                url: serverUrl + '/countAlarm',
                method: 'get',
            };

            if (loginMember?.memberNo) { // 일반회원으로 로그인 할 경우 -> memberNo 를 파라미터로 보냄
                options.params = { memberNo: loginMember.memberNo };
            } else if (loginOrg?.orgNo) { // 단체회원으로 로그인 할 경우 -> orgNo 를 파라미터로 보냄
                options.params = { orgNo: loginOrg.orgNo };
            } else {    // 로그인 안 했을 경우 => return
                return;
            }
                const res = await axiosInstance(options);
                const count = res.data.resData;

                set({   // unreadAlarmCount, hasNewAlert 에 set
                unreadAlarmCount: count,
                hasNewAlert: count > 0,
                });
            }
        })  
    )
);

export default useUserStore;