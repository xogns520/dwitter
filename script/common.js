/**
 * @작성일   : 2018. 6. 27.
 * @작성자   : 김대형
 * @코멘트   : Hark~
 */

	//////////////////////////////////////////////////////
	var gIndex = 0;
	var gContentArray = new Array();
	
	var gUserArray = [ '김핡핡', '현피박군', '길막테디', '대대자손', '산타페후', 'Sting', '완전용용', 'thomas yoon', '이현'];
	//////////////////////////////////////////////////////


	function gfIsEmpty(s) {
		if(s == null || s.trim() == ''){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @작성일   : 2018. 6. 30.
	 * @작성자   : 김대형
	 * @Method 설명 : ajax를 이용하여 폼을 서버로 전송하여 서버 호출
	 * @param sAction : 액션명('http://sample.com/test')
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
				if(data.status != 0){
					//gfMsgBox();
				}
			}
		});
	}
	
	function gfAjaxTestMaek(id, value){
		$('#frmTest').append('<input type="hidden" name="'+ id + '" value="'+ value + '" /> ');
	}
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
	
	function gfMemberRegisterAction(){
		$("#frmSignUp #id").val( $("#userId").val() );
		$("#frmSignUp #pass").val( $("#userPassword").val() );
		
		var sAction = "/register";
		var fnCallback = gfMemberRegisterActionCallback;
		var formData = $('#frmSignUp');
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithForm(sAction, formData, fnCallback, sMethod);
	}
	function gfMemberRegisterActionCallback(data){
		if ( "done" == data ){
			alert("가입완료");
			gfContentList();
		}else if ( "duplicate"== data ){
			alert("중복된 ID 입니다.");
		}else if ( "fail"== data ){
			alert("회원가입중 오류가 발생하였습니다.");
		}
	}

	function gfLoginAction(){
		$("#frmLogin #id").val( $("#userId").val() );
		$("#frmLogin #pass").val( $("#userPassword").val() );
		
		var sAction = "/login";
		var fnCallback = gfLoginActionCallback;
		var formData = $('#frmLogin');
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithForm(sAction, formData, fnCallback, sMethod);
	}
	function gfLoginActionCallback(data){
		if ( "done" == data ){
			alert("로그인완료");
			gfContentList();
		}else if ( "duplicate"== data ){
			alert("중복된 ID 입니다.");
		}else if ( "fail"== data ){
			alert("회원가입중 오류가 발생하였습니다.");
		}
	}
	
	

