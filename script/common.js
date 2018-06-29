/**
 * @작성일   : 2018. 6. 27.
 * @작성자   : 김대형
 * @코멘트   : Hark~
 */

	$(function(){
		gfMenuContentList();
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
	
	/* Struct
	var gContentObject = new Object();
		gContentObject.index=null;
		gContentObject.content=null;
		gContentObject.user=null;
		gContentObject.like=0;
		
	*/
	var gUserArray = [ '김핡핡', '현피박군', '길막테디', '대대자손', '산타페후', 'Sting', '완전용용', 'thomas yoon', '이현'];
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
						+ '				<img style="padding: 0px 0px 0px 0px; display: inline; max-height: 40px; max-width: 40px;" src="./images/user/' + imgIdx + '.png">'
						+ '			</td>'
						+ '		</tr>'
						+ '	</table>'
						+ '	<p class="preCon">' + data[x].data + '</p>'
						+ '	<p></p>'
						+ '	<p class="hint">'+ data[x].voting + '명이 Voting 핡핡~</p>'
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
	
	function gfContentWriteActionCallback(){
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
	
	
	

	//**********************************************************************************
	//계정목록 조회  
	//**********************************************************************************
	function getAccountList() {
		var sAction = "/account/accountListAction";
		var fnCallback = fnSetAccountTable;
		gfAjaxCallWithForm(sAction,$('#frmAccountList'),fnCallback,"POST")
	}
	function fnSetAccountTable(data) {
		$("#dataList" ).html(data);
	}

	//**********************************************************************************
	//계정생성
	//**********************************************************************************
	function fnInsert(){
		$("#frmInsert").attr("action","/account/accountInsert");
		$("#frmInsert").submit();	
	}
	//**********************************************************************************
	//계정상세정보
	//**********************************************************************************
	function fnDetailAccount(account){
		$("#frmAccountDetail #account").val(account);
		$("#frmAccountDetail").attr("action","/account/accountDetail");
		$("#frmAccountDetail").submit();	
	}



	
	
	/**
	 * 공통메시지박스
	 */
	function gfMsgBox(){
		$("#cmm_msg_box_title").text();
		$("#cmm_msg_box_layer").show();
	}
    function gfMsgBox(sMessage,sTitle,bButtonCancel,fnMsgCallback){
		if(sTitle == undefined || gfIsEmpty(sTitle)){
			$('#cmm_msg_box_head').hide();
		} else {
			$('#cmm_msg_box_head').show();
		}

		if(bButtonCancel == undefined || bButtonCancel == null){
			bButtonCancel = false;
		}
		
		//버튼이벤트 처리

		$('#cmm_msg_box_btn_ok').bind("click",function(){
			$('#cmm_msg_box_btn_ok').unbind("click");
			if(fnMsgCallback != undefined){
				fnMsgCallback();
			}
			gfMsgBoxClose();
			
		});

		$('#btnPopCancel').bind("click",function(){
			$('#btnPopOk').unbind("click");
			$('#btnPopCancel').unbind("click");
		});
		
		if(bButtonCancel){
			$('#cmm_msg_box_btn_close').show();
		} else {
			$('#cmm_msg_box_btn_close').hide();
		}

		//메세지 표시
		$('#cmm_msg_box_title').html(sTitle);
		$('#cmm_msg_box_msg').html(sMessage);
		//팝업 표시
		/*
		var oLayer = $("#layer_msg");
		oLayer.fadeIn(100);
		*/
		//$('#btnPopOk').focus();
		$("#cmm_msg_box_layer").show();

	}	
	
	function gfMsgBoxClose(){
		$("#cmm_msg_box_layer").hide();
	}


      /**
       * @작성일   : 2016. 9. 23.
       * @작성자   : sulmin
       * @Method 설명 : ajax를 이용하여 서버 호출
       * @param sAction : 액션명('IoT/get')
       * @param sParam :파라미터(a=1&b=3)
       * @param fnCallback : 콜백함수(function reference)
       * @param sMethod : 호출 메쏘드(GET/POST 등)
       */
      function gfCallServer(sAction,sParam,fnCallback,sMethod){

      	if(sMethod == undefined){
      		sMethod = "GET";
      	}

      	$.ajax({
      	   url: sAction ,
      	   type: sMethod,
      	   data: sParam ,
      	   dataType : "json",
      	   success: function(data){
      		   fnCallback(data);
      	   },
      	   error: function(data, status, err) {
      		   /* 서버와 통신중 오류가 발생하였습니다. */
      		if(data.status != 0){
      	  		gfMsgBox();
      	  	}
      	   }
      	});
      }
       
       /**
        * @작성일   : 2016. 9. 28.
        * @작성자   : 김대형
        * @Method 설명 : ajax를 이용하여 폼을 서버로 전송하여 서버 호출
        * @param sAction : 액션명('IoT/get')
        * @param oForm : 서버로 전송할 form 객체
        * @param fnCallback : 콜백함수(function reference)
        * @param sMethod : 호출 메쏘드(GET/POST 등)
        */
       function gfCallWithForm(sAction,oForm,fnCallback,sMethod){

       	if(sMethod == undefined){
       		sMethod = "POST";
       	}

       	$.ajax({
       	   url: sAction + ".json",
       	   type: sMethod,
       	   data: oForm.serialize() ,
       	   dataType : "json",
       	   success: function(data){
       		   fnCallback(data);
       	   },
       	   error: function(data, status, err) {
       		/* 서버와 통신중 오류가 발생하였습니다. */
       		if(data.status != 0){
       	  		gfMsgBox();
       	  	}
       	   }
       	});
       }    
       
     /**
      * @작성일   : 2016. 8. 9.
      * @작성자   : sulmin
      * @Method 설명 : ajax를 이용하여 파라미터를 이용하여 서버 호출
      * @param sAction : 액션명('portal/get')
      * @param sParam : 서버로 전송할 파라미터
      * @param fnCallback : 콜백함수(function reference)
      * @param sMethod : 호출 메쏘드(GET/POST 등)
      */
     function gfAjaxCallServer(sAction,sParam,fnCallback,sMethod){

     	if(sMethod == undefined){
     		sMethod = "POST";
     	}

     	$.ajax({
     	   url: sAction, //+ ".ajax",
     	   type: sMethod,
     	   data: sParam ,
     	   success: function(data){
     		   fnCallback(data);
     	   },
     	   error: function(data, status, err) {
     		  /* 서버와 통신중 오류가 발생하였습니다. */
     		 if(data.status != 0){
      		 	gfMsgBox();
      		 }
     	   }
     	});
     }
      /**
       * @작성일   : 2016. 8. 9.
       * @작성자   : sulmin
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
      	   data: oForm.serialize() ,
      	   success: function(data){
      		   fnCallback(data);
      	   },
      	   error: function(data, status, err) {
      		  /* 서버와 통신중 오류가 발생하였습니다. */
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
