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
	$(document).ready(function(){
		
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
			window.location.href="index.html";
			//gfContentList();
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
	
	function gfIsLoginAction(callback){
		var sAction = "/isLogin";
		var fnCallback = callback;
		var param = "";
		var sMethod = "POST";	// GET/POST
		gfAjaxCallWithParam(sAction, param, fnCallback, sMethod);
	}

//Teddy, get name call back test
	function gfGetUserName(data){
		return(data.id);
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
