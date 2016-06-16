## HTML

### Include css + js

	<head>
	...
		<script type="text/javascript" src="vxgplayer.js"></script>
		<link href="vxgplayer.css" rel="stylesheet"/> 
	...
	</head>

### Div element for player

	<div class="vxgplayer"
		id="vxg_media_player1" 
		width="640"
		height="480"
		url="rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov"
		nmf-src="pnacl/Release/media_player.nmf"
		nmf-path="media_player.nmf"
		useragent-prefix="MMP/3.0"
		latency="10000"
		autohide="2"
		volume="0.7"
		avsync
		controls
		mute
		aspect-ratio
		aspect-ratio-mode="1"
		auto-reconnect></div>

#### Attributes:

* **id** - unique id of player
* **class** must be 'vxgplayer' - for automatically init all players after load body
* **width** - width of player, integer 
* **height** - height of player, integer
* **url** - link to rtsp video
* **nmf-src** - link to plugin, default value: 'pnacl/Release/media_player.nmf'
* **nmf-path** - link to plugin, default value: 'media_player.nmf'
* **latency** - latency, integer
* **autohide** - autohide panel of the controls after, seconds
* **volume** - volume, float, Possible values: 0..1
* **avsync** - If attribute exists then avsync true. If attribute does not exist then avsync false
* **controls** - Panel with controls. If attribute exists then show controls. If attribute does not exist then hide controls
* **debug** - Debug mode. If attribute exists then you will see a lot of messages in js console. If attribute does not exist, it will be silent
* **mute** - Mute audio. If attribute exists then mute. If attribute does not exist then no mute
* **useragent-prefix** - Set prefix for user agency
* **aspect-ratio** - If attributes aspect-ratio or aspect-ratio-mode exist then aspectRatio true
* **aspect-ratio-mode** - 1:Fit-to-Screen(default); 2:Crop; 0:Off. If attribute exists then aspectRatio true
* **auto-reconnect** - If attribute auto-reconnect exists then the player will be auto reconnected on any error

## JavaScript Examples

### Dynamically create players with options

Put element to your page:

	<div id="dynamicallyPlayers"></div>

And below function will create the players inside element 'dynamicallyPlayers'

	function createPlayer(){
		indexPlayer++;
		var playerId = 'vxg_media_player' + indexPlayer;
		var div = document.createElement('div');
		div.setAttribute("id", playerId);
		div.setAttribute("class", "vxgplayer");
		var runtimePlayers = document.getElementById('dynamicallyPlayers');
		runtimePlayers.appendChild(div);
		vxgplayer(playerId, {
				url: '',
				nmf_path: 'media_player.nmf',
				nmf_src: 'pnacl/Release/media_player.nmf',
				latency: 300000,
				aspect_ratio_mode: 1,
				autohide: 3,
				controls: true
		}).ready(function(){
			console.log(' =>ready player '+playerId);
			vxgplayer(playerId).src('rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov');
			vxgplayer(playerId).play();
			console.log(' <=ready player '+playerId);
		});

	}

### Init player and/or find player

	var player = vxgplayer('vxg_media_player1');
	// where 'vxg_media_player1' - unique id element in document

### Play / isPlaying

	vxgplayer('vxg_media_player1').play(); // play
	vxgplayer('vxg_media_player1').isPlaying() // get play true of false
	// or 
	var player = vxgplayer('vxg_media_player1');
	player.play()
	player.isPlaying() // get play true of false

### Pause

	vxgplayer('vxg_media_player1').pause();
	// or
	var player = vxgplayer('vxg_media_player1');
	player.pause()

### Stop

	vxgplayer('vxg_media_player1').stop();
	// or
	var player = vxgplayer('vxg_media_player1');
	player.stop()

### Autohide

	vxgplayer('vxg_media_player1').autohide(2); // set 2 seconds
	vxgplayer('vxg_media_player1').autohide(); // get autohide value
	// or
	var player = vxgplayer('vxg_media_player1');
	player.autohide(2); // set 2 seconds
	player.autohide(); // get autohide value

### Aspect Ratio

	vxgplayer('vxg_media_player1').aspectRatio(true); // set aspect ration to true
	vxgplayer('vxg_media_player1').aspectRatio(); // get aspect ration value
	// or
	var player = vxgplayer('vxg_media_player1');
	player.aspectRatioMode(2); // set aspect ration to true. Mode: Crop
	player.aspectRatioMode(); // get aspect ratio mode value

### Auto reconnect

	vxgplayer('vxg_media_player1').autoreconnect(1); // set auto-reconnect on
	vxgplayer('vxg_media_player1').autoreconnect(); // get autoreconnect value

### Volume

Possible value of volume: 0..1

	// possible value of volume: from 0 to 1
	// example
	vxgplayer('vxg_media_player1').volume(0.8); // set volume
	var vol = vxgplayer('vxg_media_player1').volume(); // get volume
	// or
	var player = vxgplayer('vxg_media_player1');
	player.volume(0.8); // set volume
	var vol = player.volume(); // get volume

### Size

Set new size of player

	vxgplayer('vxg_media_player1').size(1280, 720); // set size
	var size = vxgplayer('vxg_media_player1').size(); // get size
	console.log('Player width: ' + size.width);
	console.log('Player height: ' + size.height);
	// or
	var player = vxgplayer('vxg_media_player1');
	player.size(1280, 720); // set size
	var size2 = player.size(); // get size
	console.log('Player width: ' + size2.width);
	console.log('Player height: ' + size2.height);

### Latency

	vxgplayer('vxg_media_player1').latency(10000); // set latency
	console.log(vxgplayer('vxg_media_player1').latency()); // get latency
	// or
	var player = vxgplayer('vxg_media_player1');
	player.latency(10000); // set latency
	var ltnc = player.latency(); // get latency

### Source / URL

	vxgplayer('vxg_media_player1').src('rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov'); // set src
	var src = vxgplayer('vxg_media_player1').src(); // get src
	// or
	var player = vxgplayer('vxg_media_player1');
	player.src('rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov'); // set src
	var src = player.src(); // get src

### Error

This method returned last error code or -1 if has not error.

	// NO_ERROR == -1
	// MEDIA_ERR_URL == 0
	// MEDIA_ERR_NETWORK == 1
	// MEDIA_ERR_SOURCE == 2
	// MEDIA_ERR_CARRIER == 3
	// MEDIA_ERR_AUDIO == 4
	// MEDIA_ERR_VIDEO == 5
	// MEDIA_ERR_AUTHENTICATION == 6
	// MEDIA_ERR_BANDWIDTH == 7
	// MEDIA_ERR_EOF == 8

	var err;

	err = vxgplayer('vxg_media_player1').error(); // get error code
	// or
	var player = vxgplayer('vxg_media_player1');
	var err = player.error(); // get error code

	// example of handling by code error
	switch (err) {
		case 0:
			// MEDIA_ERR_URL
			break
		case 1:
			// MEDIA_ERR_NETWORK
			break
		case 2:
			// MEDIA_ERR_SOURCE
			break
		case 3:
			// MEDIA_ERR_CARRIER
			break
		case 4:
			// MEDIA_ERR_AUDIO
			break
		case 5:
			// MEDIA_ERR_VIDEO
			break
		case 6:
			// MEDIA_ERR_AUTHENTICATION
			break
		case 7:
			// MEDIA_ERR_BANDWIDTH
			break
		case 8:
			// MEDIA_ERR_EOF
			break
		default:
			// no error
	}

### Show/Hide Custom Error

	vxgplayer('vxg_media_player1').showerror('some error'); // show error overlay
	vxgplayer('vxg_media_player1').hideerror(); // hide error overlay
	// or
	var player = vxgplayer('vxg_media_player1');
	player.showerror('some error'); // show error overlay
	player.hideerror(); // hide error overlay
		

### Controls

	var ctrls;
	
	vxgplayer('vxg_media_player1').controls(true); // set latency
	ctrls = vxgplayer('vxg_media_player1').controls(); // get latency
	// or
	var player = vxgplayer('vxg_media_player1');
	player.controls(true); // set latency
	ctrls = player.controls(); // get latency

### Debug

	var dbg;
	
	vxgplayer('vxg_media_player1').debug(true); // set debug mode
	dbg = vxgplayer('vxg_media_player1').debug(); // get debug mode
	// or
	var player = vxgplayer('vxg_media_player1');
	player.debug(true); // set debug mode
	dbg = player.debug(); // get debug mode

### Mute / isMute

Toggle method. And Getter

	var mute;
	
	vxgplayer('vxg_media_player1').mute(); // toggle mute false -> true and true -> false
	mute = vxgplayer('vxg_media_player1').isMute(); // getter
	// or
	var player = vxgplayer('vxg_media_player1');
	player.mute();  // toggle mute false -> true and true -> false
	mute = player.isMute(); // get state of mute

### Ready State


	// possible values of readyState:
	// 0 - PLAYER_STOPPED
	// 1 - PLAYER_CONNECTING
	// 2 - PLAYER_PLAYING
	// 3 - PLAYER_STOPPING

	var rs;

	rs = vxgplayer('vxg_media_player1').readyState(); 
	// or
	var player = vxgplayer('vxg_media_player1');
	rs = player.readyState();
	// example of handling by code error
	switch (rs) {
		case 0:
			// PLAYER_STOPPED
			break
		case 1:
			// PLAYER_CONNECTING
			break
		case 2:
			// PLAYER_PLAYING
			break
		case 3:
			// PLAYER_STOPPING
			break
		default:
			// no ready
	}

### Version
	var player = vxgplayer('listener2');
	player.versionPLG(); //version of chrome plugin
	player.versionAPP(); //version of VXG Media Player app

### Callback onReadyStateChange

	vxgplayer('vxg_media_player1').onReadyStateChange(function(onreadyState){
		console.log("player LOADED: versionPLG=" + vxgplayer('vxg_media_player1').versionPLG()+" versionAPP="+vxgplayer('vxg_media_player1').versionAPP());
	});
	// or
	var player = vxgplayer('listener2');
	player.onReadyStateChange(function(state){
		console.log("player LOADED: versionPLG=" + player.versionPLG()+" versionAPP="+player.versionAPP());
	});

### Callback onStateChange

	vxgplayer('vxg_media_player1').onStateChange(function(readyState){
		console.log("NEW READY STATE: " + readyState);
	});
	// or
	var player = vxgplayer('listener2');
	player.onStateChange(function(state){
		console.log("NEW READY STATE: " + readyState);
	});

### Callback onError


	vxgplayer('vxg_media_player1').onError(function(player){
		console.log(player.error());
	});
	// or
	var player = vxgplayer('vxg_media_player1');
	player.onError(function(player){
		console.log(player.error());
	});
	
### Callback onBandwidthError

	// Behaivor:
	// 1. If exists handler onBandwidthError then call it.
	// 2. If not exists then show error('Problem with bandwidth')

	vxgplayer('vxg_media_player1').onBandwidthError(function(player){
		console.log(player.error());
	});
	// or
	var player = vxgplayer('vxg_media_player1');
	player.onBandwidthError(function(player){
		console.log(player.error());
	});
