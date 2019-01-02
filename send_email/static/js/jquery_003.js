(function($) {
	$.fn.isAfter = function(sel){
		return this.prevAll().filter(sel).length !== 0;
	};

	$.fn.isBefore = function(sel){
		return this.nextAll().filter(sel).length !== 0;
	};
	
	$.collapsable = new NezCollapsable($);
	
	$.fn.collapsable = function(){
		$.collapsable.makeCollapsable(this);
	};
	
	$.fn.collapsableTrigger = function(){
		$.collapsable.triggerCollapsable(this);
	};
})(jQuery);

function NezCollapsable($) {
	var collapseGroupList = {
		'root': {	
			'collapsableOpen': null,
			'collapsableBlockOpen': null
		}
	};

	var collapsableHeight = function(collapsableBlock) {
		var h = 0;
		var paddingList = collapsableBlock.getElementsByClassName('padding');
		for (var i = paddingList.length - 1; i >= 0; i--) {
			if (paddingList[i].parentNode == collapsableBlock) {
				h += paddingList[i].clientHeight;
			}
		}
		return h;
	};

	var closeCollapsable = function(collapsableBlock) {
			collapsableBlock.style.height = collapsableHeight(collapsableBlock)+"px";
			setTimeout(function() {
				collapsableBlock.style.height = "0px";
			}, 10);
	};

	var openCollapsable = function(collapsableBlock) {
		collapsableBlock.style.height = collapsableHeight(collapsableBlock)+"px";
	};
	
	var getCollapseGroup = function(collapsable) {
		var collapseGroupName = $(collapsable).data('collapse-group');
		if (!collapseGroupName) {
			collapseGroupName = 'root';
		}
		var collapseGroup = collapseGroupList[collapseGroupName];
		if (!collapseGroup) {
			collapseGroupList[collapseGroupName] = {	
				'collapsableOpen': null,
				'collapsableBlockOpen': null
			};
			collapseGroup = collapseGroupList[collapseGroupName];
		}
		return collapseGroup;
	};

	var scrollBack = function(collapsable, duration) {
		var offset = $(collapsable).offset();

		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + window.innerHeight;

		if (offset.top < docViewTop || offset.top > docViewBottom) {
			setTimeout(function() {
				$("html, body").animate({scrollTop: (offset.top-5)+"px"}, duration);
			}, 10);
		}
	}

	this.makeCollapsable = function(jquerySelectedObjects) {
		var openList = [];
		jquerySelectedObjects.each(function() {
			var collapsable = this;
			var collapsableBlock = null;
			$(collapsable).find('.collapsableBlock').each(function() {
				collapsableBlock = this;
				return false;
			});
			
			var transitionDuration = function(collapsableBlock) {
				var duration = $(collapsableBlock).css('transition-duration');
				if (duration.endsWith('ms')) {
					duration = parseFloat(duration);
				} else if (duration.endsWith('s')) {
					duration = parseFloat(duration)*1000.0;
				}
				return duration;
			};
			
			var toggleFunction = function() {
				if ($(collapsable).hasClass('independant')) {
					if ($(collapsable).hasClass('open')) {
						$(collapsable).removeClass('complete');
						closeCollapsable(collapsableBlock);
						setTimeout(function() {
							var duration = transitionDuration(collapsableBlock);
							scrollBack(collapsable, duration); 
						}, 10);
					} else {
						openCollapsable(collapsableBlock);
						setTimeout(function() {
							$(collapsable).addClass('complete');
							collapsableBlock.style.height = 'auto';
						}, transitionDuration(collapsableBlock)+10);
					}
					$(collapsable).toggleClass('open');
				} else {
					var collapseGroup = getCollapseGroup(collapsable);
					if (collapseGroup.collapsableOpen) {
						closeCollapsable(collapseGroup.collapsableBlockOpen);
						$(collapseGroup.collapsableOpen).removeClass('open');
						$(collapseGroup.collapsableOpen).removeClass('complete');
					}
					if (collapseGroup.collapsableOpen !== collapsable) {
						collapseGroup.collapsableOpen = collapsable;
						collapseGroup.collapsableBlockOpen = collapsableBlock;
						openCollapsable(collapsableBlock);
						$(collapsable).addClass('open');
						setTimeout(function() {
							$(collapsable).addClass('complete');
							collapsableBlock.style.height = 'auto';

							var duration = transitionDuration(collapseGroup.collapsableBlockOpen);

							scrollBack(collapsable, duration); 
						}, transitionDuration(collapsableBlock));
					} else {
						collapseGroup.collapsableOpen = null;
						collapseGroup.collapsableBlockOpen = null;
					}
				}
			};
	
			if ($(collapsable).hasClass('open')) {
				openList.push({collapsable:collapsable, collapsableBlock:collapsableBlock});
			}
			
			$(this).find('a.trigger').each(function() {
				if (collapsable.id != this.hash.substr(1)) {
					return true;
				}
				$(this).on('click', function() {
					if ($(this).hasClass('disabled')) {
						return false;
					}
					if ($(collapsable).hasClass('open')) {
						if ($(this).hasClass('open')) {
							return false;
						}
					} else {
						if ($(this).hasClass('close')) {
							return false;
						}
					}
					toggleFunction();
					
					return false;
				});
			});
		});
		while (openList.length > 0) {
			var openItem = openList.pop();
			var collapsable = openItem.collapsable;
			var collapsableBlock = openItem.collapsableBlock;

			if (!$(collapsable).hasClass('independant')) {
				var collapseGroup = getCollapseGroup(collapsable);
				collapseGroup.collapsableOpen = collapsable;
				collapseGroup.collapsableBlockOpen = collapsableBlock;
			}
			collapsableBlock.style.height = "auto";
		}
		jquerySelectedObjects.each(function() {
			$(this).addClass('loaded');
			if ($(this).hasClass('open')) {
				$(this).addClass('complete');
			}
		});
	};

	this.triggerCollapsable = function(jquerySelectedObjects) {
		jquerySelectedObjects.each(function() {
			if (!this.href) {
				return;
			}
			$(this).on('click', function() {
				$(this.hash).trigger('click');
				return false;
			});
		});
	};
}

function MobileSelect(select) {
	var selectObject = select;
	selectObject.style.display = 'none';
	
	var element = document.createElement('div');
	element.className = "selectBox collapsable independant";
	this.element = element;

	var trigger = document.createElement('a');
	trigger.href = "#";
	trigger.className = 'trigger';

	var title = document.createElement('div');
	title.className = 'title';
	title.innerHTML = selectObject.options[0].innerHTML;
	trigger.appendChild(title);

	element.appendChild(trigger);
	
	var collapsableBlock = document.createElement('div');
	collapsableBlock.className = 'collapsableBlock';
	collapsableBlock.style.height = '0px';
	element.appendChild(collapsableBlock);

	var padding = document.createElement('div');
	padding.className = 'padding';
	collapsableBlock.appendChild(padding);

	var createOption = function(index) {
		var opt = document.createElement('div');
		opt.className = 'option';
		if (i == selectObject.selectedIndex) {
			opt.className += ' selected';
			selectedOption = opt;
		}
		opt.innerHTML = selectObject.options[i].innerHTML;
		
		$(opt).on('click', function() {
			selectedOption.className = 'option';
			selectedOption = this;
			this.className = 'option selected';
			title.innerHTML = this.innerHTML;
			selectObject.selectedIndex = index;
			$(trigger).trigger('click');
		});
		
		padding.appendChild(opt);
	}

	var selectedOption = null;

	for (var i=0; i<selectObject.options.length; i++) {
		createOption(i);
	}
}
