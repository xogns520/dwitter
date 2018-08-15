/**
 * @작성일   : 2018. 6. 27.
 * @작성자   : 김대형
 * @코멘트   : Hark~
 */

	//////////////////////////////////////////////////////
	var gIndex = 0;
	var gContentArray = new Array();
	
	//var gUserArray = [ '김핡핡', '현피박군', '길막테디', '대대자손', '산타페후', 'Sting', '완전용용', 'thomas yoon', '이현'];
	//////////////////////////////////////////////////////
	$(document).ready(function(){
		gfGetUserInfo();
	});

	function gfIsEmpty(s) {
		if(s == null || s.trim() == ''){
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @작성일   : 2018. 7. 2.
	 * @작성자   : 김대형
	 * @Method 설명 : ajax를 이용하여 폼을 서버로 전송하여 서버 호출
	 * @param sAction : 액션명('http://sample.com/test')
	 * @param oForm : 서버로 전송할 파라메타
	 * @param fnCallback : 콜백함수(function reference)
	 * @param sMethod : 호출 메쏘드(GET/POST 등)
	 * @param bCheckDouble : 동일 리소스 호출방지 적용여부(default : true)
	 */
	function gfAjaxCallWithParam(sAction,sParam,fnCallback,sMethod){
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
				//gfMsgBox();
				}
			}
		});
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
		if ( "fail" == data ){
			alert("ID / PW 를 확인하세요.");
		}else{
			window.location.href="index.html";
		}
	}
	
	function gfLogoutAction(){
		var sAction = "/logout";
		var fnCallback = gfLogoutActionCallback;
		var param = "";
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithParam(sAction, param, fnCallback, sMethod);
	}
	function gfLogoutActionCallback(data){
		if ( "done" == data ){
			alert("로그아웃 되었습니다.");
			window.location.href="index.html";
		}
	}

	function gfIsLoginAction(callback){
		var sAction = "/isLogin";
		var fnCallback = callback;
		var param = "";
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithParam(sAction, param, fnCallback, sMethod);
	}
	
	function gfGetUserInfo(){
		gfIsLoginAction(gfGetUserInfoCallback);
	}
	
	function gfGetUserInfoCallback(data){
		if ( "true" == data.result ){
			$("#frmUserInfo #id").val(data.id);
			
			$("#linkWallet").show();
			$("#linkUserInfo").show();
			$("#linkFollow").show();
			$("#linkLogin").hide();
			$("#linkLogout").show();
			$("#linkSingup").hide();
			
		}else{
			$("#linkWallet").hide();
			$("#linkUserInfo").hide();
			$("#linkFollow").hide();
			$("#linkLogin").show();
			$("#linkSingup").show();
			$("#linkLogout").hide();
			
		}

	}
	
	//http://osvaldas.info/elegant-css-and-jquery-tooltip-responsive-mobile-friendly
	function gfTooltip(){
		//tooltip = $( '<div id="tooltip" style="display: inline;"></div>' );
		
		var targets = $( '[rel~=tooltip]' ),
	    target  = false,
	    tooltip = false,
	    title   = false;
		$("abbr").bind( 'mouseenter', tooltipActive);
		//$(document).on( 'click', 'abbr', toolFunction);
	}
	
	/* html 텍스트 내용이 잘릴경우 overflow true/false 반환 */ 
	function gfTextOverCheck(obj){
		var res;
		var cont = $('<div>'+obj.text()+'</div>').css("display", "table")
	   				.css("z-index", "-1").css("position", "absolute")
					.css("font-family", obj.css("font-family"))
					.css("font-size", obj.css("font-size"))
					.css("font-weight", obj.css("font-weight")).appendTo('body');
		res = (cont.width()>obj.width());
		cont.remove();
		return res;
	}
	
	function tooltipActive(){
		target  = $( this );
	    target.append( '<div id="tooltip"></div>' );
	    //alert("아이폰 테스트");
	    tooltip = $("#tooltip");
	    tip     = target.attr( 'title' );
	    //tooltip = $( '<div id="tooltip" style="display: inline;"></div>' );
	
	    if( !tip || tip == '' )
	        return false;
	
	    target.removeAttr( 'title' );
	    tooltip.css( 'opacity', 0 )
	           .html( tip )
	           .appendTo( 'body' );
	
	    var init_tooltip = function()
	    {
	        if( $( window ).width() < tooltip.outerWidth() * 1.5 )
	            //tooltip.css( 'max-width', $( window ).width() / 2 );
	        	tooltip.css( 'max-width', $( window ).width() - 20 );
	        else
	            tooltip.css( 'max-width', 340 );
	

	        var pos_left = target.offset().left + ( target.outerWidth() -20 ) - ( tooltip.outerWidth() - 20 ),
	            pos_top  = target.offset().top - tooltip.outerHeight() - 20;
	
	        if( pos_left < 0 )
	        {
	            pos_left = target.offset().left + target.outerWidth() - 20;
	            tooltip.addClass( 'left' );
	        }
	        else
	            tooltip.removeClass( 'left' );
	
	        if( pos_left + tooltip.outerWidth() > $( window ).width() )
	        {
	            pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
	            tooltip.addClass( 'right' );
	            //alert("pos_left + tooltip.outerWidth() > $( window ).width()");
	        }
	        else
	            tooltip.removeClass( 'right' );
	
	        if( pos_top < 0 )
	        {
	            var pos_top  = target.offset().top + target.outerHeight();
	            tooltip.addClass( 'top' );
	        }
	        else
	            tooltip.removeClass( 'top' );
	
	        tooltip.css( { left: 10 /* pos_left*/ , top: pos_top } )
	               .animate( { top: '+=10', opacity: 1 }, 50 );
	        /*
	        alert(
	        		"offset:" + target.offset().left
	        		+ "\n" + "top:" + pos_top 
	        		+ "\n" + "left:" + pos_left 
	        		+ "\n" + "Width:" + $( window ).width()  
    		);
    		*/
	    };
	
	    init_tooltip();
	    $( window ).resize( init_tooltip );
	
	    var remove_tooltip = function()
	    {
	        tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
	        {
	            $( this ).remove();
	        });
	
	        target.attr( 'title', tip );
	    };
	    target.bind( 'mouseleave', remove_tooltip );
	    tooltip.bind( 'click', remove_tooltip );
	}
