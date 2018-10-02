/**
 * @작성일   : 2018. 6. 30.
 * @작성자   : 김핡핡
 * @코멘트   : dabble common
 * @변경일   : 2018. 10. 2. 
 * @변경점   : 핡 각각 영향도가 있고 헨들링 헬이라 다 분리시켜놓고 확인 ㄱㄱ
 *  
 */





	var gVoteIdx = null;
	var pageCount = 20;
	/**
	 * 목록 조회
	 * @returns
	 */
	function gfContentList(page){
		if ( undefined == page ){
			page = 0;
		}
		$("#frmRead #page").val(page);
		var sAction = "/read";
		var fnCallback = gfContentListCallback;
		gfAjaxCallWithForm(sAction,$('#frmRead'),fnCallback,"POST");
	}
	function gfContentListCallback(data){
		$("div[id='contentList']").empty();
		
		for ( var x = 0 ; x < data.length ; x++ ){
			
			var btnVoteEnable = "";
			if ( undefined != data[x].votingenable  && "false" == data[x].votingenable ){
				btnVoteEnable = "disabled";
			}
			
			var strProfile = (data[x].profile == null) ? "" : data[x].profile ;
			var profilePath = (strProfile.length == 5) ? "./images/user/" + strProfile : strProfile;
			
			var parentId = data[x].parentid == null ? "" :data[x].parentid;
			
			var replyBtn = '	<button type="button" name="btnDetail" style="width:25%;" class="btn btn-default" onClick="javascript:fnContentDetailInsertPopup(' + x + ');" ><i class="fa fa-commenting-o"></i></button>'
			if ( "" != parentId ){
				replyBtn= '';
			}
			
			
			var strHtml	= '<div class="element tile-1 home calc bg-change">'
						+ '	<table style="width: 100%;">'
						+ '		<tr>'
						+ '			<td>'
						+ '				<h4 class="header icon-to-the-right">' + data[x].account + '</h4>'
//						+ '				<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tooltip on bottom" aria-describedby="tooltip113771">Bottom</button>'
						+ '			</td>'
						+ '			<td  style="text-align:right; margin: 0px;" onClick="javascript:gfFollowPopup(' + x + ');">'
						+ '				<img name="userImage" style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src="' + profilePath + '">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<div onClick="javascript:fnContentDetailPopup(' + x + ')" name="viewDefault" class="preConSimple">' + data[x].data + '</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<div class="hint" name="createTime">'+ timeConverter(data[x].date) + '</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<button type="button" name="btnVote" ' + btnVoteEnable +  ' style="width:30%;" class="btn btn-default" onClick="javascript:gfContentVoteAction(\'' + data[x].id + '\');" ><i name="viewVoteCount" class="fa fa-thumbs-o-up"> ' + data[x].voting + '</i></button>'
						+ '	<button type="button" name="btnUpdate" style="width:20%; display:none;" class="btn btn-default" onClick="javascript:gfContentUpdate(' + x + ');" ><i class="fa fa-edit"></i></button>'
						+ '	<button type="button" name="btnDetail" style="width:20%;" class="btn btn-default" onClick="javascript:fnContentDetail(' + x + ');" ><i class="fa fa-folder-open"></i></button>'
						+ replyBtn
						+ '	<input type="hidden" name="hBoardId" value="' + data[x].id + '" >'
						+ '	<input type="hidden" name="hBoardParentId" value="' + parentId + '" >'
						+ '	<input type="hidden" name="hVoteCnt" value="' + data[x].voting + '" >'
						+ '	<input type="hidden" name="hAccount" value="' + data[x].account + '" >'
						+ '</div>';
			
			$("div[id='contentList']").append(strHtml);
		}
		
		var len = $("input[name='hAccount']").length;
		var strId = $("#frmUserInfo #id").val();
		for ( var x = 0 ; x < len ; x++ ){
			if ( strId == $("input[name='hAccount']").eq(x).val() ){
				$("button[name='btnUpdate']").eq(x).show();
			}
		}
	}
	
	/**
	 * 내용 상세 조회
	 * @returns
	 */
	function fnContentDetail(idx){
		if ( $("div[name='viewDefault']").eq(idx).hasClass("preConSimple") ){
			$("div[name='viewDefault']").eq(idx).removeClass("preConSimple");
			$("div[name='viewDefault']").eq(idx).addClass("preConDetail");
		}else{
			$("div[name='viewDefault']").eq(idx).removeClass("preConDetail");
			$("div[name='viewDefault']").eq(idx).addClass("preConSimple");
		}
	}
	

	/**
	 * 글 쓰기
	 * @returns
	 */
	//Teddy, get name call back test
	function gfContentWrite(data){
		gfContentWriteAction(data.id);	
	}
	//Teddy gfContentWriteAction with Author name
	function gfContentWriteAction(userId){
		$("#frmWrite #user").val(userId);
		
		var strText = $("#contentTextarea").val();
		var strImg = "";
		var len = $("input[name='imgUrl']").length;
		
		for ( var x = 0 ; x < len ; x++ ){
			strImg += '<img src="' + $("input[name='imgUrl']").eq(x).val() + '" />';
		}
		$("#frmWrite #data").val( strText + strImg );
		
		var sAction = "/write";
		var fnCallback = gfContentWriteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmWrite'),fnCallback,"POST");
	}
	function gfContentWriteActionCallback(data){
		if ( "done" == data ){
			//alert("글쓰기 성공");
			$("#contentTextarea").val("");
			gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("글쓰기 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	
	
	/**
	 * 글쓰기 취소
	 * @returns
	 */
	function gfContentWriteCancelAction(){
		$("#contentTextarea").val("");
		gfContentList();
	}
	
	
	/**
	 * 글수정 팝업
	 * @param idx
	 * @returns
	 */
	function gfContentUpdate(idx){
		$("#imgListContentInsert").empty();
		$("#imgListContentUpdate").empty();
		$("#imgListContentDetailInsert").empty();
		$("#frmEdit #postid").val( $("input[name='hBoardId']").eq(idx).val() );
		
		var tagImg =  $("div[name='viewDefault']").eq(idx).find("img");
		var len = tagImg.length;
		
		for ( var x = 0 ; x < len ; x++ ){
			var strRep = tagImg.eq(x).attr("src").replace("/image/upload/","/image/upload/c_limit,h_60,w_90/");
			var strHtml = '<img name="imgThumbNail" onClick="javascript:fnImageDelete(this);" style="width: auto; display: inline-block; padding: 2px;" src="' + strRep + '"/>'
						+ '<input type="hidden" name="imgUrl" value="' + tagImg.eq(x).attr("src") + '" />';
			$("#imgListContentUpdate").append(strHtml);
		}
		
		$("#contentEditTextarea").val($("div[name='viewDefault']").eq(idx).text());
		
		//취소버튼 액션
		//0:목록에서수정, 1:상세댓글
		$("#btnUpdateCancel").on("click", fnUpdateCancel);
		$("#btnUpdateAction").on("click", gfContentEditAction);
		$("#contentEdit").modal("show");
		
		
	}
	
	/**
	 * 글수정 팝업
	 * @param idx
	 * @returns
	 */
	function gfContentDetailUpdate(idx){
		$("#imgListContentInsert").empty();
		$("#imgListContentUpdate").empty();
		$("#imgListContentDetailInsert").empty();
		$("#frmEdit #postid").val( $("input[name='hBoardId']").eq(idx).val() );
		
		var tagImg =  $("div[name='viewDefault']").eq(idx).find("img");
		var len = tagImg.length;
		
		for ( var x = 0 ; x < len ; x++ ){
			var strRep = tagImg.eq(x).attr("src").replace("/image/upload/","/image/upload/c_limit,h_60,w_90/");
			var strHtml = '<img name="imgThumbNail" onClick="javascript:fnImageDelete(this);" style="width: auto; display: inline-block; padding: 2px;" src="' + strRep + '"/>'
						+ '<input type="hidden" name="imgUrl" value="' + tagImg.eq(x).attr("src") + '" />';
			$("#imgListContentUpdate").append(strHtml);
		}
		
		$("#contentEditTextarea").val($("div[name='viewDefault']").eq(idx).text());
		
		//취소버튼 액션
		//0:목록에서수정, 1:상세댓글
		if ( 0 == type ){
			$("#btnUpdateCancel").on("click", fnUpdateCancel);
			$("#btnUpdateAction").on("click", gfContentEditAction);
			$("#contentEdit").modal("show");
		}else if ( 1 == type ){
			$("#contentEdit").modal("show");
			$("#popupContentDetail").modal("hide");
			$("#btnUpdateAction").on("click", gfContentDetailEditAction);
			$("#btnUpdateCancel").on("click",fnDetailUpdateCancel);
		}
	}

	
	/**
	 * 글 수정
	 * @returns
	 */
	function gfContentEditAction(){
		var strText = $("#contentEditTextarea").val();
		var strImg = "";
		var len = $("input[name='imgUrl']").length;
		
		for ( var x = 0 ; x < len ; x++ ){
			strImg += '<img src="' + $("input[name='imgUrl']").eq(x).val() + '" />';
		}
		$("#frmEdit #data").val( strText + strImg );
		
		var sAction = "/edit";
		var fnCallback = gfContentEditActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmEdit'),fnCallback,"POST");
	}
	function gfContentEditActionCallback(data){
		if ( "success" == data ){
			//alert("글쓰기 성공");
			$("#contentEditTextarea").val("");
			gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("글수정 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	function gfContentDetailEditAction(){
		var strText = $("#contentEditTextarea").val();
		var strImg = "";
		var len = $("input[name='imgUrl']").length;
		
		for ( var x = 0 ; x < len ; x++ ){
			strImg += '<img src="' + $("input[name='imgUrl']").eq(x).val() + '" />';
		}
		$("#frmEdit #data").val( strText + strImg );
		
		var sAction = "/edit";
		var fnCallback = gfContentDetailEditActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmEdit'),fnCallback,"POST");
	}
	function gfContentDetailEditActionCallback(data){
		if ( "success" == data ){
			//alert("글쓰기 성공");
			$("#contentEditTextarea").val("");
			var idx = $("input[name='hBoardId']").index($("input[name='hBoardId'][value='"+ $("input[name='hBoardId']").eq(pageCount).val() +"']"));
			fnContentDetailPopup(idx);
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("글수정 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	

	/*
	 * 글 수정 닫기
	 */
	function fnUpdateCancel(){
		$("#popupReply").modal("hide");
		$("#contentEdit").modal("hide");
	}
	function fnDetailUpdateCancel(){
		$("#contentEdit").modal("hide");
		$("#popupContentDetail").modal("show");
	}
	
	/**
	 * 보팅
	 * @param id
	 * @returns
	 */
	function gfContentVoteAction(id){
		$("#frmVote #id").val(id);
		$("#frmVote #vote").val(1);
		var idx = $("input[name='hBoardId']").index($("input[name='hBoardId'][value='"+ id+"']"));
		
		var valCnt = $("input[name='hBoardId'][value='"+ $("input[name='hBoardId']").eq(idx).val()+"']").length;
		for ( var cnt = 0 ; cnt < valCnt ; cnt++ ){
			var tmpIdx = $("input[name='hBoardId']").index( $("input[name='hBoardId'][value='"+ $("input[name='hBoardId']").eq(idx).val()+"']").eq(cnt) );
			$("button[name='btnVote']").eq(tmpIdx).attr("disabled","");
		}		
		gVoteIdx = idx ;
		gfIsLoginAction(gfContentVoteActionCallback1);
	}
	function gfContentVoteActionCallback1(data){
		if ( "true" == data.result ){
			var idx = gVoteIdx;
			var valCnt = $("input[name='hBoardId'][value='"+ $("input[name='hBoardId']").eq(idx).val()+"']").length;
			for ( var cnt = 0 ; cnt < valCnt ; cnt++ ){
				var tmpIdx = $("input[name='hBoardId']").index( $("input[name='hBoardId'][value='"+ $("input[name='hBoardId']").eq(idx).val()+"']").eq(cnt) );
				var vCnt = Number($("input[name='hVoteCnt']").eq(tmpIdx).val());
				vCnt++;
				$("input[name='hVoteCnt']").eq(tmpIdx).val(vCnt);
				$("i[name='viewVoteCount']").eq(tmpIdx).text(" " + vCnt );
			}
			
			var sAction = "/vote";
			var fnCallback = gfContentVoteActionCallback2;
			gfAjaxCallWithForm(sAction,$('#frmVote'),fnCallback,"POST");
			
		}else{
			$("button[name='btnVote']").eq(gVoteIdx).attr("disabled",false);
			alert("로그인 후 사용하세요.");
			/*
			for ( var x = 0 ; x < $("input[name='hBoardId'").length ; x++ ){
				if ( $("#frmVote #id").val() == $("input[name='hBoardId'").eq(x).val() ){
					$("button[name='btnVote'").eq(x).blur();
					break;
				}
			}
			*/		
		}
	}
	function gfContentVoteActionCallback2(data){
		if ( "success" == data ){
			//alert("보팅성공");
			//gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else if ( "duplicated" == data ){
			alert("중복투표입니다.");
		}else{
			alert("보팅실패");
			$("button[name='btnVote']").eq(gVoteIdx).attr("disabled",false);
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	
	
	
	/**
	 * 팔로우 팝업
	 * @param idx
	 * @returns
	 */
	function gfFollowPopup(idx){
		$("#frmFollow #account").val($("input[name='hAccount']").eq(idx).val());
		$("span[id='myModalLabelFollowId']").text($("input[name='hAccount']").eq(idx).val());
		$("#userImage").attr("src", $("img[name='userImage']").eq(idx).attr("src") );
		//$("#userImage").attr("src", "/images/user/0.png");
		$("#followPopup").modal("show");
	}
	
	/**
	 * 팔로우 하기
	 * @returns
	 */
	function gfFollowAction(){
		var sAction = "/createfriend";
		var fnCallback = gfFollowActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmFollow'),fnCallback,"POST");
	}
	function gfFollowActionCallback(data){
		if ( "success" == data ){
			alert("Follow 하였습니다");
			$("#userImage").attr("src","");
		}else{
			alert("Follow 실패");
		}
	}
	


