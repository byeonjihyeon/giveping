import { useState } from "react"

//회원 관심단체 리스트
export default function likeOrgList(){

    const [likeOrgList, setLikeOrgList] = useState([
        {logo: '', name: '기부단체1', isLike: true },
        {logo: '', name: '기부단체2', isLike: false },
        {logo: '', name: '기부단체3', isLike: true },
        {logo: '', name: '기부단체4', isLike: false },
        {logo: '', name: '기부단체5', isLike: false },
        {logo: '', name: '기부단체6', isLike: true },
        {logo: '', name: '기부단체7', isLike: true }
    ]);

    return (
            <div className="likeOrgList-wrap">
                {likeOrgList.map(function(likeOrg, index){
                    return <LikeOrg key={"likeOrg" + index} likeOrg={likeOrg} />
                })}
            </div>
    )
}

//회원 관심단체 하나
function LikeOrg(props){

    const likeOrg = props.likeOrg;

    return (
        <div className="likeOrg-wrap">
            <div className="likeOrg-logo">
                <img src="/images/default_profile.jpg"/>
                {likeOrg.isLike ?
                     <img id="likeIcon" src="/images/favorite_38dp_EA3323.png"/>
                :
                    ""
                }
            </div>
            <div className="likeOrg-name">
                {likeOrg.name}
            </div>
        </div>
    )
}