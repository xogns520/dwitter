/**
 * @작성일   : 2018. 6. 27.
 * @작성자   : 김대형
 * @코멘트   : Hark~
 */

	$(function(){
		
	});


	//메뉴 이동 Start
	function gfMenuIndex(){
		$("section[id!='sectionIndex']").hide();
		$("section[id='sectionIndex']").show();
	}
	
	function gfMenuContentList(){
		$("section[id!='sectionContentList']").hide();
		$("section[id='sectionContentList']").show();
		gfContentList();
	}
	
	function gfMenuContentWrite(){
		$("section[id!='sectionContentWrite']").hide();
		$("section[id='sectionContentWrite']").show();
	}
	//메뉴 이동 End
	
	
	//////////////////////////////////////////////////////
	var gIndex = 0;
	var gContentArray = new Array();
	var gUserArray = [ '김핡핡', '현피박군', '길막테디', '대대자손', '산타페후', 'Sting', '완전용용', 'thomas yoon', '이현'];

	function gfAjaxTest(){
		var sAction = "/test";
		var fnCallback = gfAjaxTestCallback;
		var formData = $('#frmTest');
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithForm(sAction, formData, fnCallback, sMethod);
	}
	function gfAjaxTestCallback(data){
		console.log(data);
	}
	//////////////////////////////////////////////////////

	

	//액션 및 이벤트
	function gfContentList(){
		var rand = Number(Math.floor(Math.random() * 8));
		$("#frmRead #user").val(gUserArray[rand]);
		$("#frmRead #page").val(1);
		
		var sAction = "/read";
		var fnCallback = gfContentListCallback;
		gfAjaxCallWithForm(sAction,$('#frmRead'),fnCallback,"POST")
	}
	
	
	function gfContentListCallback(data){
		
		$("div[id='contentList']").empty();
		
		for ( var x = 0 ; x < data.length ; x++ ){
			/*
			var strHtml	= '<ol class="breadcrumb">' 
						+ '		<li class="breadcrumb-item active">' + gContentArray[x].content + '</li>'
						+ '</ol>';
			*/
/*
			var imgIdx=0;
			for ( var y = 0 ; y < gUserArray.length ; y++ ){
				if ( gUserArray[y] == gContentArray[x].user ){
					imgIdx = y;
					break;
				}
			}
*/			
			var strHtml	= '<div class="element tile-1 home calc bg-change">'
						+ '	<table style="width: 100%;">'
						+ '		<tr>'
						+ '			<td>'
						+ '				<h4 class="header icon-to-the-right">' + data[x].account + '</h4>'
						+ '			</td>'
						+ '			<td  style="text-align:right; margin: 0px;">'
//						+ '				<img style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src="./images/user/' + imgIdx + '.png">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<p class="preCon">' + data[x].data + '</p>'
						+ '	<p></p>'
						+ '	<p class="hint">'+ data[x].voting + '명 Voting</p>'
						+ '	<button type="button" class="btn btn-primary" onClick="javascript:gfContentVoteAction(\''+ data[x]._id + '\');" >보팅</button>';
						+ '	<div name="divStyle" ></div>'
						+ '</div>';
			
			$("div[id='contentList']").append(strHtml);
		}
	}
	
	
	function gfContentWriteAction(){
		var rand = Number(Math.floor(Math.random() * 8));
		$("#frmWrite #user").val(gUserArray[rand]);
		$("#frmWrite #data").val($("#contentTextarea").val());
		var sAction = "/write";
		var fnCallback = gfContentWriteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmWrite'),fnCallback,"POST")
		
	}
	
	function gfContentWriteActionCallback(data){
		console.log(data);
		if ( "done" == data ){
			alert("글쓰기 성공");
			gfMenuContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("글쓰기 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}	

	function gfContentWriteCancelAction(){
		$("#contentTextarea").val("");
		gfMenuContentList();
	}
	
	


	function gfContentVoteAction(id){
		$("#frmVote #id").val(id);
		$("#frmVote #vote").val(1);
		var sAction = "/vote";
		var fnCallback = gfContentVoteActionCallback;
		gfAjaxCallWithForm(sAction,$('#frmVote'),fnCallback,"POST");
		
	}
	function gfContentVoteActionCallback(data){
		if ( "done" == data ){
			alert("보팅성공");
			gfMenuContentList();
			//gfMsgBox(data.resultMsg, "핡~!", false, fnInsertAccountSuccessCallback);
		}else{
			alert("보팅 실패");
			//gfMsgBox(data.resultMsg, "핡~!");
		}
	}
	
	

	/**
	 * @작성일   : 2018. 6. 30.
	 * @작성자   : 김대형
	 * @Method 설명 : ajax를 이용하여 폼을 서버로 전송하여 서버 호출
	 * @param sAction : 액션명('portal/get')
	 * @param oForm : 서버로 전송할 form 객체
	 * @param fnCallback : 콜백함수(function reference)
	 * @param sMethod : 호출 메쏘드(GET/POST 등)
	 * @param bCheckDouble : 동일 리소스 호출방지 적용여부(default : true)
	 */
	function gfAjaxCallWithForm(sAction,oForm,fnCallback,sMethod, bCheckDouble){
		if(sMethod == undefined){
			sMethod = "POST";
		}
		if(bCheckDouble == undefined){
			bCheckDouble = true;
		}

		$.ajax({
			url: sAction, // + ".ajax",
			type: sMethod,
			//dataType : "json",
			data: oForm.serialize() ,
			success: function(data){
				fnCallback(data);
			},
			error: function(data, status, err) {
				/* 서버와 통신중 오류가 발생하였습니다. */
				alert("서버와 통신중 오류가 발생하였습니다.");
				console.log(data);
				console.log(status);
				console.log(err);
				if(data.status != 0){
					//gfMsgBox();
				}
			}
		});
	}
      
	function gfIsEmpty(s) {
		if(s == null || s.trim() == ''){
			return true;
		} else {
			return false;
		}
	}
