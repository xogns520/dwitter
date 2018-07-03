/**
 * @작성일   : 2018. 6. 30.
 * @작성자   : 김대형
 * @코멘트   : dabble common 
 */

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
//						+ '				<abbr id="tooltiptDiv" title="' + data[x].account + '" rel="tooltip">자세히보기</abbr>'
						+ '				<h4 class="header icon-to-the-right">' + data[x].account + '</h4>'
//						+ '				<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tooltip on bottom" aria-describedby="tooltip113771">Bottom</button>'
						+ '			</td>'
						+ '			<td  style="text-align:right; margin: 0px;">'
//+ '				<img style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src="./images/user/' + imgIdx + '.png">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<p class="preCon">' + data[x].data + '</p>'
						+ '	<p></p>'
						+ '	<p class="hint">'+ data[x].voting + '명이 Voting</p>'
						+ '	<button type="button" class="btn btn-primary" onClick="javascript:gfContentVoteAction(\''+ data[x]._id + '\');" >보팅</button>';
						+ '	<div name="divStyle" ></div>'
						+ '</div>';
			
			$("div[id='contentList']").append(strHtml);
		}
		//$("[data-toggle='tooltip']").tooltip();
		//gfTooltip();
	}
	
	/**
	 * 글 쓰기
	 * @returns
	 */
	async function gfContentWriteAction(){
		var rand = Number(Math.floor(Math.random() * 8));
		$("#frmWrite #user").val( $("#frmUserInfo #id").va() );
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
	async function gfContentWriteActionName(userId){
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
		var sAction = "/vote";
		var fnCallback = gfContentVoteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmVote'),fnCallback,"POST");
		
	}
	function gfContentVoteActionCallback(data){
		if ( "done" == data ){
			//alert("보팅성공");
			gfContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("보팅실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	
