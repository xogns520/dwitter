/**
 * @작성일   : 2018. 6. 27.
 * @작성자   : 김대형
 * @코멘트   : Hark~
 */

	//메뉴 이동 Start
	function gfMenuIndex(){
		$("section[id!='sectionIndex']").hide();
		$("section[id='sectionIndex']").show();
	}
	
	function gfMenuContentList(){
		$("section[id!='sectionContentsList']").hide();
		$("section[id='sectionContentsList']").show();
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
	//////////////////////////////////////////////////////
	
	//액션 및 이벤트
	function gfContentList(){
		$("div[id='contentList']").empty();
		
		for ( var x = 0 ; x < gContentArray.length ; x++ ){
			var strHtml	= '<ol class="breadcrumb">' 
						+ '		<li class="breadcrumb-item active">' + gContentArray[x].content + '</li>'
						+ '</ol>';
			$("div[id='contentList']").append(strHtml);
		}
	}
	
	function gfContentWriteAction(){
		var contentObject = new Object();
		contentObject.index = gIndex;
		contentObject.content = $("#contentTextarea").val();
		gIndex++;
		gContentArray.push(contentObject);
		$("#contentTextarea").val("");
		gfMenuContentList();
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
