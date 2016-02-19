/*************************************
// 市川電産 & Code for Numazu
// 入力文字を登録画像で表示するアプリ
// 2016/2/19
*************************************/
// グローバル変数
var nImagefile = 26;							// 画像フォルダのファイル数
var ViewString = "ぼくたちかわいいね！";		// 表示したい文字
var nCount = 0;								// 表示位置
var move_time = 1000;						// 切り替え時間

// 画像描画用の配列
var ary = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];


/**********************************
// 文字からピクセルに変換
//
**********************************/
function mozi2pixel( mozi ) {
	// 一瞬現れるのを買いhするために一旦ものすごい下の方に表示場所
	var viewstr = "<p id='testmozi'><span style='font-size: 16px;'>" + mozi +"</span></p>";
	if (navigator.userAgent.indexOf('Android') > 0){
	 	viewstr = "<p id='testmozi'><span style='font-size: 15px;'>" + mozi +"</span></p>";
	}

	$('body').append( viewstr );
	$('#testmozi').offset({top: 3000, left: 0});

    var element = $('#testmozi')[0];
    console.log( "1" );
    html2canvas(element, { onrendered: function(canvas) {
		$('#testmozi').remove();
    	// イメージデータ
        var imgData = canvas.toDataURL();

        var context = canvas.getContext('2d');
        var imageData = context.getImageData( 0, 0, canvas.width, canvas.height);
        var dataArray = imageData.data;
        var len = dataArray.length;
        console.log( canvas.width );
        console.log( canvas.height );
        console.log( len );

        // 標準はMacモード
        var limit = 3;

		if (navigator.userAgent.indexOf('Win') > 0) {
			limit = 0;
		}else if (navigator.userAgent.indexOf('Android') > 0){
			limit = 0;
		}

        // ピクセルデータの中身の解析
        for( var i = 0; i < len; i += 4 ){
        	var yy = Math.floor(( i / ( canvas.width * 4 )));
        	var xx = (i - ( yy * canvas.width * 4 ) ) / 4;

        	if( yy < limit ) continue;
        	if( yy > ( 15 + limit ) ) continue;
        	if( xx > 15 ) continue;

        	var arg = ( dataArray[ i ] + dataArray[ i + 1 ] + dataArray[ i + 2 ] ) / 3;
        	if( dataArray[ i + 3 ] > 100 ){
        		//console.log( arg );
        		ary[ yy - limit ][ xx ] = 1;
        	}else{
        		ary[ yy - limit ][ xx ] = 0;
        	}
        }

	    // 文字の描画
	    draw_mozi();
    }});
}


/***********************************
// 描画
***********************************/
function draw_mozi(){
	// 前のデータを破棄
	var str = ".box";
	$(str).remove();

	// divを作成する
	for( var ix = 0; ix < 16; ix++ ){
		for( var iy = 0; iy < 16; iy++ ){
			var str = "<div id='box" + iy + "-" + ix + "'' class='box'></div>";
			$('body').append( str );
		}
	}

	// 一つあたりの画像サイズを確定
	if($(window).height() < $(window).width() ){
		var h_size = Math.floor($(window).height() / 16);
		var w_size = Math.floor(h_size * 1.5);
	}else{
		var w_size = Math.floor($(window).width() / 16);
		var h_size = Math.floor(w_size * 0.66);
	}
	var sh_size = h_size + "px";
	var sw_size = w_size + "px";

	// 配列見て表示処理
	for( var ix = 0; ix < 16; ix++ ){
		for( var iy = 0; iy < 16; iy++ ){
			var str = "#box" + iy + "-" + ix;
			if( ary[iy][ix] != 0 ){
				var rand = Math.floor(Math.random() * nImagefile);
				var str2 = "url('./img/" + rand + ".jpg')";

			    $(str).css({
			        backgroundImage: str2,
			        backgroundSize: 'Contain'
			    });	

			    // クリックした画像を拡大表示
				$(str).click(function(){
					location.href = "./img/" + rand + ".jpg";
				});

			}
			$(str).offset({top: h_size * iy, left: w_size * ix});
			$(str).css('width', sw_size);
			$(str).css('height', sh_size);
		}
	}

	// 次に切り替える
	nCount++;
	console.log( ViewString.length, nCount );
	if( ViewString.length > nCount ){
		var	dostr = "mozi2pixel( '" + ViewString.charAt( nCount ) + "');";
		console.log( dostr );
		setTimeout( dostr, move_time );
	}
}

/**********************************
// 開始コマンド
//
***********************************/
function viewstart(){
	if( $("#viewtextbox").val()　!= "" ){
		ViewString = $("#viewtextbox").val();
	}
	$("#first").remove();

	mozi2pixel( ViewString.charAt( nCount ) );

}
