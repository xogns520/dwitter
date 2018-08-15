/**
 * @작성일   : 2018. 6. 30.
 * @작성자   : 김핡핡
 * @코멘트   : dabble common 
 */



	var gVoteIdx = null;
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
			
			var btnVoteEnable = 'false' == data[x].votingenable ? 'disabled' : '';
			var strProfile = (data[x].profile == null) ? "" : data[x].profile ;
			var profilePath = (strProfile == 5) ? '"./images/user/' + strProfile : '"' + strProfile;
	
				
			var strHtml	= '<div class="element tile-1 home calc bg-change">'
						+ '	<table style="width: 100%;">'
						+ '		<tr>'
						+ '			<td>'
						+ '				<h4 class="header icon-to-the-right">' + data[x].account + '</h4>'
//						+ '				<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tooltip on bottom" aria-describedby="tooltip113771">Bottom</button>'
						+ '			</td>'
						+ '			<td  style="text-align:right; margin: 0px;" onClick="javascript:gfFollowPopup(' + x + ');">'
						+ '				<img name="userImage" style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src=' + profilePath + '">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<div name="viewDefault" class="preConSimple">' + data[x].data + '</div>'
//						+ '	<div name="viewDetail" style="display: none;">' + data[x].data + '</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<div class="hint" name="viewVoteCount">'+ data[x].voting + '명이 Voting</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<button type="button" name="btnVote" ' + btnVoteEnable +  ' style="width:20%;" class="btn btn-default" onClick="javascript:gfContentVoteAction(\''+ data[x].id + '\');" ><i class="fa fa-thumbs-o-up"></i></button>'
						+ '	<button type="button" name="btnUpdate" style="width:20%; display:none;" class="btn btn-default" onClick="javascript:gfContentUpdate(' + x + ');" ><i class="fa fa-edit"></i></button>'
						+ '	<button type="button" name="btnDetail" style="width:20%;" class="btn btn-default" onClick="javascript:fnContentDetail(' + x + ');" ><i class="fa fa-folder-open"></i></button>'
						+ '	<input type="hidden" name="hBoardId" value="' + data[x].id + '" >'
						+ '	<input type="hidden" name="hVoteCnt" value="' + data[x].voting + '" >'
						+ '	<input type="hidden" name="hAccount" value="' + data[x].account + '" >'
						+ '</div>';
			
			$("div[id='contentList']").append(strHtml);
			/*
			var obj = $("div[name='viewDefault']").eq(x);
			if ( gfTextOverCheck(obj) ){
				$("button[name='btnDetail']").eq(x).show();
			}
			*/
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
	function gfContentWriteAction(){
		var rand = Number(Math.floor(Math.random() * 8));
		$("#frmWrite #user").val( $("#frmUserInfo #id").val() );
		$("#frmWrite #data").val( $("#contentTextarea").val() );
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

	//Teddy gfContentWriteAction with Author name
	function gfContentWriteActionName(userId){
		$("#frmWrite #user").val(userId);
		$("#frmWrite #data").val($("#contentTextarea").val());
		var sAction = "/write";
		var fnCallback = gfContentWriteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmWrite'),fnCallback,"POST");
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
		$("#frmEdit #postid").val( $("input[name='hBoardId']").eq(idx).val() );
		$("#contentEditTextarea").text($("div[name='viewDefault']").eq(idx).html());
		$("#btnContentEidt").click();
	}

	/**
	 * 글 수정
	 * @returns
	 */
	function gfContentEditAction(){
		$("#frmEdit #data").val( $("#contentEditTextarea").text() );
		var sAction = "/edit";
		var fnCallback = gfContentEditActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmEdit'),fnCallback,"POST");
	}
	function gfContentEditActionCallback(data){
		if ( "success" == data ){
			//alert("글쓰기 성공");
			$("#contentEditTextarea").text("");
			gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("글수정 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	
	/**
	 * 보팅
	 * @param id
	 * @returns
	 */
	function gfContentVoteAction(id){
		$("#frmVote #id").val(id);
		$("#frmVote #vote").val(1);

		gfIsLoginAction(gfContentVoteActionCallback1);
	}
	function gfContentVoteActionCallback1(data){
		if ( "true" == data.result ){
			
			for ( var x = 0 ; x < $("input[name='hBoardId']").length ; x++ ){
				if ( $("#frmVote #id").val() == $("input[name='hBoardId']").eq(x).val() ){
					$("button[name='btnVote']").eq(x).attr("disabled","");
					
					var vCnt = Number($("input[name='hVoteCnt']").eq(x).val());
					vCnt++;
					$("input[name='hVoteCnt']").eq(x).val(vCnt);
					$("div[name='viewVoteCount']").eq(x).text(vCnt + "명이 Voting");
					
					gVoteIdx = x;
					break;
				}
			}			
			
			var sAction = "/vote";
			var fnCallback = gfContentVoteActionCallback2;
			gfAjaxCallWithForm(sAction,$('#frmVote'),fnCallback,"POST");
			
		}else{
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
		if ( "done" == data ){
			//alert("보팅성공");
			//gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("보팅실패");
			$("button[name='btnVote'").eq(gVoteIdx).attr("disabled",false);
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
		$("#btnFollowPopup").click();
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
	


