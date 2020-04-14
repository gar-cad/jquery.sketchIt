function sketchIt(element, settings) {
	this.canvas;
	this.ctx;
	this.penDown;
	this.mode;
	this.clicks;
	this.maxClicks;
	this.history;
	this.$me = $(element);			
	this.settings = settings;
	this.init();
	t = this; // allows us to access this within 
	
	// CLICK EVENTS
	this.$me.on('vmousedown',function() {
		if (t.mode!='arrow') {
			t.penDown = true;				
			t.clicks++;
			t.maxClicks++;
			t.draw({'mode':'start','x':event.pageX,'y':event.pageY,'clickId':t.clicks},true);
		}
	})
	.on('vmousemove',function() {
		if (t.penDown && t.mode!='arrow') {
			t.draw({'mode':t.mode,'x':event.pageX,'y':event.pageY},true);
		}
	})
	.on('vmouseup',function() {
		if (t.penDown && t.mode!='arrow') {
			t.penDown = false;
		}
	});
	
	// TOOLS OPTIONS
	if (settings.tools) {
		ref = ['color', 'width','cap','tool'];
		$('body').on('click','[data-control="#' + (this.$me.attr('id')) + '"]',function(event) {
			for (i = 0; i < ref.length; i++) {
				$data = $(this).attr("data-" + ref[i]);
				if ($data) {
					t.changeSetting(ref[i],$data);
				}
			}
			$data = $(this).attr("data-options");
			if ($data) {
				switch($data) {
					case 'clear':
						t.clearCanvas();
						t.history = [];
						break;
					case 'undo':
						t.undo();
						break;
					case 'redo':
						t.redo();
				}
			}
		})
	}
}

sketchIt.prototype = {
	init: function() {
		this.$me.append('<canvas class="sketchIt" width="'+this.$me.width()+'" height="'+this.$me.height()+'"></canvas>');
		this.canvas = this.$me.find('.sketchIt')[0];
		this.ctx = this.canvas.getContext('2d');
		this.penDown = false;
		this.clicks = 0;
		this.maxClicks = this.clicks;
		this.history=[];
		this.changeSetting('color',this.settings.color);
		this.changeSetting('width',this.settings.width);
		this.changeSetting('cap',this.settings.cap);
		this.changeSetting('tool',this.settings.mode);
	},
	changeSetting: function(key,val) {
		if (this.settings.tools) {
			$('[data-' + key+']').removeClass('current');
			$('[data-' + key+'="'+val+'"]').addClass('current');
			$('[data-category="' + key+'"] .catview').remove();
			$('[data-category="' + key+'"]').prepend('<span class="catview">'+$('[data-' + key+'="'+val+'"]').html()+'</span>');
		}
		log = {'mode':'set','key':key,'val':val};
		this.set(log,true);
	},
	set: function(log,logIt) {
		switch (log.key) {
			case 'color':
				this.ctx.strokeStyle=log.val;
				break;
			case 'width':
				this.ctx.lineWidth=log.val;
				break;
			case 'cap':
				this.ctx.lineCap=log.val;
				this.ctx.lineJoin=log.val;
				break;
			case 'fill':
				this.ctx.fillStyle = log.val;
				break;
			case 'tool':
				if (log.val=='arrow') {
					$(document).unbind('vmousemove');
				} else {
					$(document).bind('vmousemove', false);
				}
				cursor = log.val=='arrow' ? 'auto' : 'crosshair';
				this.$me.find('.sketchIt').css('cursor',cursor);
				this.mode=log.val;
				break;
		}
		if (logIt) { this.history.push(log) };
	},
	draw: function(log,logIt) {
		if (log.mode=='eraser') {
			this.ctx.globalCompositeOperation="destination-out";
		} else {
			this.ctx.globalCompositeOperation="source-over";
		}
		switch(log.mode) {
			case 'pen':case'eraser':
				this.ctx.lineTo(log.x,log.y);
				this.ctx.stroke();
				break;
			case 'start':
				this.ctx.beginPath();
				this.ctx.moveTo(log.x,log.y);
				break;
		}
		if (logIt) { this.history.push(log) };
	},
	undo: function() {
		this.clicks--;
		this.redrawHistoryToPos();
	},
	redo: function() {
		if (this.clicks<this.maxClicks) {this.clicks++};
		this.redrawHistoryToPos();
	},
	redrawHistoryToPos: function() {
		this.clearCanvas(false);
		for (i=0; i<this.history.length; i++) {
			log = this.history[i];
			if (log.clickId>this.clicks) {
				break;
			} else {
				(log.mode=='set') ? this.set(log,false) : this.draw(log,false);
			}
		}
	},
	clearCanvas: function(logIt) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
		if (logIt) { this.history.push({'mode':'clear'}) };
	}
}
;(function ( $, window, document, undefined ) {
	// ANGEN POSITION I NEUD UNDO REDO, FEL PAN UNDO, POSITION = POSITION -1 = clicks;
	$.fn.sketchIt = function(options) {
		var settings = $.extend({
			color:'#f00',
			width:5,
			cap:'round',
			mode:'pen',
			tools:true
		}, options);		
		
		return this.each(function() {
			new sketchIt(this, settings);
		});
		
	}	
})( jQuery, window, document );
