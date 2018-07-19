/**
 * @작성일   : 2018. 6. 30.
 * @작성자   : 김대형
 * @코멘트   : dabble common 
 */

	var gVoteIdx = null;
	/**
	 * 목록 조회
	 * @returns
	 */
	function gfContentList(){
		var rand = Number(Math.floor(Math.random() * 8));
		$("#frmRead user").val(gUserArray[rand]);
		var sAction = "/read";
		var fnCallback = gfContentListCallback;
		gfAjaxCallWithForm(sAction,$('#frmRead'),fnCallback,"POST");
	}
	function gfContentListCallback(data){
		$("div[id='contentList']").empty();
		
		for ( var x = 0 ; x < data.length ; x++ ){
			var strHtml	= '<div class="element tile-1 home calc bg-change">'
						+ '	<table style="width: 100%;">'
						+ '		<tr>'
						+ '			<td>'
						+ '				<h4 class="header icon-to-the-right">' + data[x].account + '</h4>'
//						+ '				<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tooltip on bottom" aria-describedby="tooltip113771">Bottom</button>'
						+ '			</td>'
						+ '			<td  style="text-align:right; margin: 0px;">'
						+ '				<img style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src="./images/user/' + data[x].profile + '">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<div name="viewDefault" class="preConSimple">' + data[x].data + '</div>'
//						+ '	<div name="viewDetail" style="display: none;">' + data[x].data + '</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<div class="hint" name="viewVoteCount">'+ data[x].voting + '명이 Voting</div>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<button type="button" name="btnVote" style="width:100%;" class="btn btn-primary" onClick="javascript:gfContentVoteAction(\''+ data[x].id + '\');" >보팅</button>'
//						+ '	<abbr id="tooltiptDiv" title="' + data[x].data + '" rel="tooltip">상세보기1-툴팁</abbr>'
						+ '	<div style="margin: 5px;"></div>'
						+ '	<button type="button" name="btnDetail" style="width:100%; display: none;" class="btn btn-primary" onClick="javascript:fnContentDetail(' + x + ');" >상세보기</button>'
						+ '	<input type="hidden" name="hBoardId" value="' + data[x].id + '" >'
						+ '	<input type="hidden" name="hVoteCnt" value="' + data[x].voting + '" >'
						+ '	<div name="divStyle" ></div>'
						+ '</div>';
			
			$("div[id='contentList']").append(strHtml);
			var obj = $("div[name='viewDefault']").eq(x);
			if ( gfTextOverCheck(obj) ){
				$("button[name='btnDetail']").eq(x).show();
			}
		}
		gfContentReadVoteAction();
		//$("[data-toggle='tooltip']").tooltip();
		//gfTooltip();
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
	 * 리드 보팅
	 * @returns
	 */
	function gfContentReadVoteAction(){
		$("#frmReadVote #id").val($("#frmUserInfo #id").val());
		var sAction = "/readvote";
		var fnCallback = gfContentReadVoteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmReadVote'),fnCallback,"POST");
	}
	function gfContentReadVoteActionCallback(data){
		if (  0 < data.length ){
			for ( var x = 0 ; x < data.length ; x++ ){
				for ( var y = 0 ; y < $("input[name='hBoardId']").length ; y++ ){
					if ( data[x].boardId == $("input[name='hBoardId']").eq(y).val() ){
						$("button[name='btnVote'").eq(y).attr("disabled","");
						break;
						
					}
				}
			}
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
	 * 보팅
	 * @param id
	 * @returns
	 */
	function gfContentVoteAction(id){
		$("#frmVote #id").val(id);
		$("#frmVote #vote").val(1);
		
		for ( var x = 0 ; x < $("input[name='hBoardId'").length ; x++ ){
			if ( id == $("input[name='hBoardId'").eq(x).val() ){
				$("button[name='btnVote'").eq(x).attr("disabled","");
				
				var vCnt = Number($("input[name='hVoteCnt'").eq(x).val());
				vCnt++;
				$("input[name='hVoteCnt'").eq(x).val(vCnt);
				$("div[name='viewVoteCount']").eq(x).text(vCnt + "명이 Voting");
				
				gVoteIdx = x;
				break;
			}
		}
		
		var sAction = "/vote";
		var fnCallback = gfContentVoteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmVote'),fnCallback,"POST");
		
	}
	

	
	
	function gfContentVoteActionCallback(data){
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
	
	


