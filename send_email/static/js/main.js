(function($) {

function setupCollapsable() {
	$('.collapsable').collapsable();
}

function setViewport() {
	if (document.querySelector) {
		var viewport = document.querySelector("meta[name=viewport]");
		if (window.innerHeight >= window.innerWidth) { // portrait
			var w = screen.width;
		} else { // landscape
			var w = screen.height;
		}
		if (w < 1100 && w >= 600) { // set scale for tablets and large resolution phones.
			contentWidth = 750;
		} else if (w < 600) {
			contentWidth = 320;
		} else {
			contentWidth = w;
		}
		viewport.setAttribute('content', 'width='+contentWidth+', initial-scale='+(w/contentWidth)); // device width/content width
		document.body.style.backgroundColor = document.body.style.backgroundColor; // forces full screen redraw. (iOS has problems with clearing the frame buffer when changing content width on orientationchange)
	}
}

function setImagePopup() {
	var popupLayer = document.createElement('div');
	popupLayer.id = 'popupLayer';
	popupLayer.className = 'popupLayer';
	document.body.appendChild(popupLayer);

	var $popupLayer = $(popupLayer);

	$popupLayer.on('click', function() {
		$popupLayer.removeClass('display');
		setTimeout(function() {
			$popupLayer.removeClass('show');
		}, 500);
	});
	var popupAnchorList = document.getElementsByClassName('img-popup');
	for (var i = popupAnchorList.length - 1; i >= 0; i--) {
		$(popupAnchorList[i]).on('click', function() {
			popupLayer.innerHTML = '<img src="'+this.href+'" />';
			showPopupLayer($popupLayer)
			return false;
		});
	}
}

function showPopupLayer($popupLayer) {
	if (!$popupLayer) {
		$popupLayer = $('#popupLayer');
	}
	$popupLayer.addClass('show');
	setTimeout(function() {
		$popupLayer.addClass('display');
	}, 1);
}

function getWistiaScript(id, aspect) {
	return '<script src="https://fast.wistia.com/embed/medias/'+id+'.jsonp"></script><script src="https://fast.wistia.com/assets/external/E-v1.js"></script><div class="wistia_responsive_padding" style="padding:'+aspect+'% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_'+id+' seo=false videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/'+id+'/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>';
}

function setupWistia() {
	var wistiaList = document.getElementsByClassName("wistia");
	for (var i = wistiaList.length - 1; i >= 0; i--) {
		(function(wistia) {
			var wid = wistia.getAttribute("wistia-id");
			var waspect = wistia.getAttribute("wistia-aspect");
			var placeholderList = wistia.getElementsByClassName('placeholder');
			for (var i = placeholderList.length - 1; i >= 0; i--) {
				var placeholder = placeholderList[i];
				$(placeholder).on('click', function() {
					var s = getWistiaScript(wid, waspect);
					$(wistia).html(s);
					window._wq = window._wq || [];
					_wq.push({ id: wid, onReady: function(video) {
						video.play();
					}});
				});
			}
		})(wistiaList[i]);
	}
}

function setupMobileSelect() {
	$('.contact-form select').each(function() {
		var s = new MobileSelect(this);
		this.parentNode.appendChild(s.element);
	});
}

function setupHDP() {
	var hdpPopup = document.getElementById('hdpPopup');
	var popupLayer = document.getElementById('popupLayer');
	if (hdpPopup && popupLayer) {
		popupLayer.appendChild(hdpPopup);
		$('#packageContainer .us a.button').on('click', function() {
			showPopupLayer($(popupLayer));
			return false;
		});
	}
}

function setupPromoCode() {
	var u = leh_var('u', false);
	if (u) {
		$('.prc').each(function() {
			this.innerHTML = this.innerHTML.replace('None', u);
		});
	}
}

$(function() {
	setupWistia();
	setupMobileSelect();
	setupCollapsable();
	setImagePopup();
	setupHDP();
	setupPromoCode();
	if (window.addEventListener) {
		setViewport();
	}
});

})(jQuery);
