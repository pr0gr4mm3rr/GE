 var Overview= {
	pageID: '.page-overview',
	init: function () {
		$('.page-content').hide();
		onPage = 'overview';
		$('.bar-title h1').html('Overview');
		$('.bar-title span').html('');		
		Request.send({});	
		this.content();
		Login.close();
		$('#header').show();
		$('#help-bar').show();
		$('#content').show();
		$(this.pageID).show();
		return false;
	},
	close: function(){
		$(this.pageID).hide();
		return false;
	},
	content: function(){
		var fleet = Overview.countFleet(responseObj.state.fleet, responseObj.state.user.id);
		$('.fleet-counter').html(fleet.own+'/<b>'+fleet.enemy+'</b>'); 
		$('.overview-planet-name').html(planet.name);
		$('.overview-planet-coords').html('['+planet.g+':'+planet.s+':'+planet.p+']');
		$('.overview-planet-fields').html(exactNumber(planet.diameter)+' km ('+planet.field_current+'/'+planet.field_max+')');
		$('.overview-planet-temp').html('Approx. '+planet.temp_min+'&deg; to '+planet.temp_max+'&deg;');
		$('.overview-planet-rank').html(''+prettyNumber(responseObj.state.user.points)+' (Rank&nbsp;'+responseObj.state.user.rank+' of&nbsp;'+responseObj.total_users+')');
		$('.overview-planet-online').html(''+responseObj.online_users+' Users');
		$('.planet-info .planet-img').css('background-image', 'url("images/planets/'+planet.image+'.png")');
		if (parseInt(planet.moon_id) > 0) {
			$('.moon-img').show();
			$('.planet-img').attr('rel', planet.moon_id);
			$('.moon-img').attr('rel', planet.moon_id);
		}else if (parseInt(planet.planet_type) == 3){
			$('.moon-img').hide();
			foreach(responseObj.state.planets, function(pl){
				if (pl.moon_id == planet.id){
					$('.planet-img').attr('rel', pl.id);
				}
			});
		}else{
			$('.moon-img').hide();
			$('.moon-img').attr('rel', '');
		}
		
		$('.planet-timer').html();
		
		$('.server_game_speed').html('x'+(responseObj.state.user.game_speed / 2500));
		$('.server_fleet_speed').html('x'+(responseObj.state.user.fleet_speed / 2500));
		$('.server_resources').html('x'+responseObj.state.user.resource_multiplier);
		$('.server_df_percent').html(responseObj.state.user.FLEET_TO_DEBRIES+'%');
		$('.server_attacks').html((parseInt(responseObj.state.user.attack_enabled) == 1 ? '<span style="color:green">Yes</span>' : '<span style="color:red">No</span>'));
		
		if(!Check.isEmpty(responseObj.state.global_notification)){
			$('.global-message-holder').html('<div class="global_message '+responseObj.state.global_notification_type+'">'+responseObj.state.global_notification+'</div>');
		}
		
		
		//$('#blc').countdown({until: ".$Value.", compact: true,description: ''});
		return false;
	},
	countFleet:function(obj,id){
	  var out = {own:0,enemy:0};
	  foreach(obj, function(k, v){
		  if(v.fleet_owner == id){
			  out.own++;	
		  }else if (v.fleet_owner != id && v.fleet_target_owner==id && v.fleet_mess==0) {
			  out.enemy++;
		  }
	  });
	  return out;
    },
	updateHeader:function(){
		if(!Check.isEmpty(responseObj.state.user)){
			if(parseInt(planet.metal) >= parseInt(planet.metal_max)){
				$('.metal .value').html( prettyNumber(planet.metal) ).css('color', 'red');
			}else{
				$('.metal .value').html( prettyNumber(planet.metal) ).css('color', '#ffffff');
			}
			if(parseInt(planet.crystal) >= parseInt(planet.crystal_max)){
				$('.crystal .value').html( prettyNumber(planet.crystal) ).css('color', 'red');
			}else{
				$('.crystal .value').html( prettyNumber(planet.crystal) ).css('color', '#ffffff');
			}
			if(parseInt(planet.deuterium) >= parseInt(planet.deuterium_max)){
				$('.deuterium .value').html( prettyNumber(planet.deuterium) ).css('color', 'red');
			}else{
				$('.deuterium .value').html( prettyNumber(planet.deuterium) ).css('color', '#ffffff');
			}
			//$('.metal .value').html( parseInt(planet.metal) );
			//$('.crystal .value').html( parseInt(planet.crystal) );
			//$('.deuterium .value').html( parseInt(planet.deuterium) );
			var energy = parseInt(planet.energy_max) + parseInt(planet.energy_used);
			if( energy < 0){
			   $('.energy .value').html( prettyNumber(energy) ).css('color', 'red');
			}else{
			   $('.energy .value').html( prettyNumber(energy) ).css('color', '#ffffff');
			}
			//Mailbox
			if( parseInt(responseObj.state.user.has_mail) < 1){
			   //$('.mailbox').css('background-image', 'url(../images/i-mail.png)');
			   $('.mailbox').removeClass('new-message-icon');
			}else{
			   //$('.mailbox').css('background-image', 'url(../images/i-mail-new.png)');
			   $('.mailbox').addClass('new-message-icon');
			}

			var planet_list = '';
			
			foreach (responseObj.state.planets_sorted, function(k, p){
    			var current = '';
				if(parseInt(planet.id) == parseInt(p.id)){
				   current = 'selected="selected"';
				}
				planet_list += '<option value="'+p.id+'" '+current+'>'+p.name+' ['+p.g+':'+p.s+':'+p.p+']</option>';
				
			});

			/*foreach(responseObj.state.planets, function(k, p){console.log(count(p));
				var current = '';
				if(parseInt(planet.id) == parseInt(p.id)){
				   current = 'selected="selected"';
				}
				planet_list += '<option value="'+p.id+'" '+current+'>'+p.name+' ['+p.g+':'+p.s+':'+p.p+']</option>';
				
			});*/
			
			$('.planet-select-holder').html('<select class="planet-select" onchange="Overview.changePlanet();">'+planet_list+'</select>');

			var timer_building = '';
			var timer_research = '';
			if(!Check.isEmpty(planet.b_building_id)){
				var buildQueStr = planet.b_building_id;
				var buildQue = buildQueStr.split(';');
				var curBuild = buildQue[0];
				var buildArr = curBuild.split(',');
				
				var restTime = parseInt(planet.b_building) - parseInt(responseObj.timestamp);
				timer_building = '<div><div style="font-size:9px;padding:2px;text-align:left;">'+lang._T('tech_'+buildArr[0])+' ('+buildArr[1]+')'+'</div><div style="padding:2px;text-align:right;"><div id="overview-planet-timer" class="js_timer" timer="'+restTime+'|1" style="font-size:9px;"></div></div></div>';
			}
			if(parseInt(user.b_tech_planet) > 0){
				var research_planet = responseObj.state.planets[user.b_tech_planet];
				
				var restTime = parseInt(research_planet.b_tech) - parseInt(responseObj.timestamp);
				timer_research = '<div style="background:none;"><div style="font-size:9px;padding:2px;text-align:left;">'+lang._T('tech_'+research_planet.b_tech_id)+' ('+(parseInt(user[research_planet.b_tech_id]) +1)+')'+'</div><div style="padding:2px;text-align:right;"><div id="overview-planet-timer" class="js_timer" timer="'+restTime+'|1" style="font-size:9px;"></div></div></div>';
			}
			$('.planet-timer').html('<div class="table">'+timer_building+timer_research+'</div>');		
			
		}
	},
	toggleTime:function(){

	},
	changePlanet:function(pid){
		pid = typeof pid !== 'undefined' ? pid : $('.planet-select option:selected').val();
		Request.send({object:'planet', action:'set', pid:pid});
		if(responseObj.status != 100){
			alertify.alert(lang._T(responseObj.error));
			return false;
		}else{
			if (isset(planetPages[onPage])){
				planetPages[onPage].init();
			} else if (isset(globalPages[onPage])){
				$(globalPages[onPage].pageID).show();
			}
			return false;
		}
	},
	restorePage:function(){
		if (isset(planetPages[onPage])){
			$(planetPages[onPage].pageID).show();
		} else if (isset(globalPages[onPage])){
			$(globalPages[onPage].pageID).show();
		}
		return false;
	},
	renamePlanet:function(){
		alertify.prompt("Rename Planet", function (e, str) {
		    // str is the input text
		    if (e) {
		        Request.send({object:'planet', action:'rename', newname:str, planet_id:planet.id});
				if(responseObj.status != 100){
					alertify.alert(lang._T(responseObj.error));
					return false;
				}else{			
					$('.overview-planet-name').html(str);
					$('.planet-control-modal, .overlay').hide();
				}
		    } else {
		        // user clicked "cancel"
		    }
		}, planet.name);
    },
	movePlanet:function(){
		alertify.prompt('Move Planet<br/><small style="color:red">To move planet will cost you 10,000 Dark Matter</small>', function (e, str) {
		    // str is the input text
		    if (e) {
		        if(!str.match(/\d[0-9]{0,1}:\d[0-9]{0,2}:\d[0-9]{0,1}/g)){
					alertify.alert(lang._T('New planet position is incorrect.'));
					return false;
				}
				Request.send({object:'planet', action:'move', position:str, planet_id:planet.id});
				if(responseObj.status != 100){
					alertify.alert(lang._T(responseObj.error));
					return false;
				}else{			
					$('.overview-planet-coords').html('['+str+']');
					$('.planet-control-modal, .overlay').hide();
				}
		    } else {
		        // user clicked "cancel"
		    }
		}, 'Enter new position. Ex: '+planet.g+':'+planet.s+':'+planet.p);
    },
	deletePlanet:function(){
		if(planet.planet_type == 3){
			var msg = 'Are you sure you want to delete moon <b>'+planet.name+' ['+planet.g+':'+planet.s+':'+planet.p+']</b>?';
		}else{
			var msg = 'Are you sure you want to delete planet on coordinates <b>['+planet.g+':'+planet.s+':'+planet.p+']</b>?';
		}
		
		alertify.confirm(msg, function (e) {
		    if (e) {
		        Request.send({object:'planet', action:'delete', planet_id:planet.id});
				if(responseObj.status != 100){
					alertify.alert(lang._T(responseObj.error));
					return false;
				}else{			
					$('.planet-control-modal, .overlay').hide();
					Overview.init();
				}
		    } else {
		        // user clicked "cancel"
		    }
		});
    },
	generateFleet:function(){
		var fleet_array = responseObj.state.fleet;
		
		var out = '';
		foreach(fleet_array, function(k,f){

			var ships_total;
			if(!Check.isEmpty(f.fleet_amount)){
				ships_total = 'Fleet of '+exactNumber(f.fleet_amount)+' ships';
			}else{
				ships_total = 'Fleet of unknown size';
			}

			var target_types = {1: 'planet', 2: 'debris', 3: 'moon'};
			var target_type = target_types[parseInt(f.fleet_end_type)] || 'planet';

			var msg;
			if(parseInt(f.fleet_mess) == 0){
				msg = 'Arrival to target '+target_type+':';
			}else{
				msg = 'Arrival back to home:';
			}
			
			var fleet_out = '';
			if(!Check.isEmpty(f.fleet_types)){
				var i = 1;
				var end = false;
				foreach(f.fleet_types, function(ship,amount){
					if(i == 1){
						fleet_out += '<div>';
						end = false;
					}
					fleet_out += '<div><b>'+lang._T('tech_'+ship)+'</b>: '+exactNumber(amount)+'</div>';
					
					if(i==2){
						fleet_out += '</div>';
						end = true;
						i=1;
					}else{
						i=2;
					}
					
				});
				if(end == false){
					fleet_out += '</div>';
				}
					
				fleet_out = '<div class="table fleet-resources-table">'+fleet_out+'</div>';
			}else if(Check.isEmpty(f.fleet_types) && !Check.isEmpty(f.fleet_amount)){
			
				fleet_out = '<p>'+exactNumber(f.fleet_amount)+' Ships in total</p>';
			}else{
				fleet_out = '<p>Fleet is invisible</p>';
			}
			




			var mission = '';
			if(parseInt(f.fleet_mission) == 1){ mission = 'Attack';}
			else if(parseInt(f.fleet_mission) == 2){ mission = 'ACS Attack';}
			else if(parseInt(f.fleet_mission) == 3){ mission = 'Transport';}
			else if(parseInt(f.fleet_mission) == 4){ mission = 'Deploy';}
			else if(parseInt(f.fleet_mission) == 5){ mission = 'Hold Position';}
			else if(parseInt(f.fleet_mission) == 6){ mission = 'Spy';}
			else if(parseInt(f.fleet_mission) == 7){ mission = 'Colonize';}
			else if(parseInt(f.fleet_mission) == 8){ mission = 'Recycle';}
			else if(parseInt(f.fleet_mission) == 9){ mission = 'Destroy';}
			else if(parseInt(f.fleet_mission) == 10){ mission = 'Missiles Attack';}
			else if(parseInt(f.fleet_mission) == 15){ mission = 'Expedition';}
			
			//buttons
			var buttons = '';
			var acs = '';
			var arrival_time = '';
			
			var fleet_status = 'own';
			if(parseInt(f.fleet_owner) == parseInt(user.id)){
				if(parseInt(f.fleet_mess) == 0 && parseInt(f.fleet_mission) != 10){
					buttons += '<button class="side-fleet-return btn" rel="'+f.fleet_id+'" onclick="fleetCallback(\''+f.fleet_id+'\');">Recall</button>';
					if(parseInt(f.fleet_mission) == 1 || parseInt(f.fleet_mission) == 2 || parseInt(f.fleet_mission) == 9 || parseInt(f.fleet_mission) == 10){
						buttons += '<a class="galaxy-link-spy btn" rel="'+f.fleet_end_galaxy+';'+f.fleet_end_system+';'+f.fleet_end_planet+';'+f.fleet_end_type+'" style="margin-left:10px;" onclick="galaxyMissionSpy(\''+f.fleet_end_galaxy+';'+f.fleet_end_system+';'+f.fleet_end_planet+';'+f.fleet_end_type+'\');">Spy</a>';
					}
				}
				if(parseInt(f.fleet_mission) == 1 && parseInt(f.fleet_mess) == 0  && parseInt(f.fleet_group) < 1){
					buttons += '<button class="side-fleet-acs btn" rel="'+f.fleet_id+'" onclick="showACSBtn('+f.fleet_id+');" style="margin-left:10px;">ACS Attack</button>';
				}
				
				if(parseInt(f.fleet_group) > 1 && parseInt(f.fleet_mess) == 0){
					var acs_users='';
					if(!Check.isEmpty(f.acs.users)){
        				foreach(f.acs.users, function(k,v){
    						acs_users += '<p>'+v+'</p>';
    					});
					}					
					acs += '<b>Invite to ACS</b><div class="asc-add-block">\
							<input type="text" value="" placeholder="Username" name="asc-username" class="asc-username asc-username-'+f.fleet_id+'"><div rel="'+f.fleet_id+'" class="btn" onclick="ascAdd('+f.fleet_id+');">Add</div>\
							<div class="clear"></div>\
						</div>\
						<div class="acs-users">\
							<b>Already Invited:</b>\
							<div class="asc-invited asc-invited-'+f.fleet_id+'">'+acs_users+'<div>\
						</div>';
				}
				
			}else{
				if(parseInt(f.fleet_mission) == 1 || parseInt(f.fleet_mission) == 2 || parseInt(f.fleet_mission) == 9 || parseInt(f.fleet_mission) == 10){
					fleet_status = 'enemy';
				}else{
					fleet_status = 'friend';
				}
			}


			//Show arrival rite
			if(parseInt(f.fleet_owner) == parseInt(user.id)){
				if(parseInt(f.fleet_mess) == 0){
					arrival_time += '<b>Arrival to target '+target_type+':</b> '+showFleetTime(f.fleet_start_time, f.fleet_start_time_real)+'<br/>';
				}
				if(f.fleet_mission == 5 && asDate(responseObj.timestamp) < asDate(f.fleet_end_stay)){
					arrival_time += '<b>End of mission:</b> '+showFleetTime(f.fleet_end_stay, f.fleet_end_stay_real)+'<br/>';
				}
				if (!(parseInt(f.fleet_mess) == 0 && f.fleet_mission == 4)) {
					arrival_time += '<b>Returning back to home:</b> ' + showFleetTime(f.fleet_end_time, f.fleet_end_time_real) + '<br/>';
				}
			}else{
				if(parseInt(f.fleet_mess) == 0){
					arrival_time += '<b>Arrival to your '+target_type+':</b> '+showFleetTime(f.fleet_start_time, f.fleet_start_time_real)+'<br/>';
				}
			}
			
			var from = (!Check.isEmpty(f.fleet_start_username) ? f.fleet_start_username+' ' : '')+f.fleet_start_planet_name+' ['+f.fleet_start_galaxy+':'+f.fleet_start_system+':'+f.fleet_start_planet+']';
			var to = (!Check.isEmpty(f.fleet_end_username) ? f.fleet_end_username+' ' : '')+f.fleet_end_planet_name+' ['+f.fleet_end_galaxy+':'+f.fleet_end_system+':'+f.fleet_end_planet+']';
			if(parseInt(f.fleet_start_type) == 3){
				from += ' (M)';
			}
			if(parseInt(f.fleet_end_type) == 3){
				to += ' (M)';
			}
			// reverse to and from
			if (parseInt(f.fleet_mess) != 0) {
				var tempTo = to;
				to = from;
				from = tempTo;
			}
			
			
			
			
			
			var resources = '';
			var metal = parseInt(f.fleet_resource_metal);
			var crystal = parseInt(f.fleet_resource_crystal);
			var deuterium = parseInt(f.fleet_resource_deuterium);
			var deuterium_recall = parseInt(f.fleet_resource_deuterium_recall);
			//var deuterium_recall = 100;
			if(metal > 0 || crystal > 0 || deuterium > 0 || deuterium_recall > 0){

				var resources_cargo = metal > 0 || crystal > 0 || deuterium > 0 ? '\
					<div>\
						<div style="text-align: right">'+(metal > 0 ? exactNumber(metal) : '')+'</div>\
						<div style="text-align: right">'+(crystal > 0 ? exactNumber(crystal) : '')+'</div>\
						<div style="text-align: right">'+(deuterium > 0 || deuterium_recall > 0 ? exactNumber(deuterium) : '')+'</div>\
					</div>' : '';

				var resources_recall = deuterium_recall > 0 ? '\
					<div>\
						<div></div>\
						<div></div>\
						<div style="text-align: right">'+deuterium_recall+'</div>\
					</div>' : '';

				resources = '<h3>Resources</h3>\
					<div class="table fleet-resources-table">\
						<div>\
							<div><b>Metal:</b></div>\
							<div><b>Crystal:</b></div>\
							<div><b>Deuterium:</b></div>\
						</div>\
						'+resources_cargo+'\
						'+resources_recall+'\
					</div>';
			}
			
			out += '<li class="side-fleet-row '+fleet_status+' phalanx-toggle" rel="'+f.fleet_id+'" data-id="'+f.fleet_id+'">\
						<b class="icon mission'+f.fleet_mission+'" onclick="togglePhalanx('+f.fleet_id+');"></b>\
						<span onclick="togglePhalanx('+f.fleet_id+');">\
							From '+from+'<br/>\
							To '+to+'\
						</span>\
						<div class="ui-progress-bar ui-container" onclick="togglePhalanx('+f.fleet_id+');">\
				            <div class="ui-progress" style="width: '+f.fleet_time_percent+'%;"></div>\
				            <div class="ui-label">\
				                '+msg+' <div class="flying-fleet-timer js_timer" timer="'+f.fleet_time_left+'|1|'+f.fleet_time_total+'"></div>\
				            </div>\
				        </div>\
				        <div class="clear"></div>\
						<ul style="display:none;" class="phalanx-details-toggle phalanx-details-toggle-'+f.fleet_id+'">\
							<li style="position:relative;width:100%;">\
								<div class="side-fleet-info overthrow" id="scrollasc'+f.fleet_id+'" style="overflow:hidden;"><div>\
									<p>\
										<b>Mission:</b> '+mission+'<br/>\
										<b>From:</b> '+from+'<br/>\
										<b>To:</b> '+to+'<br/>\
										'+arrival_time+'\
									</p>\
									<h3>'+ships_total+'</h3>\
									'+fleet_out+'\
									'+resources+'\
									<p style="margin-top:5px">'+buttons+'</p>\
									<div class="clear"></div>\
									<div class="side-acs-block asc-block-'+f.fleet_id+'">'+acs+'</div>\
								</div></div>\
								<div class="clear"></div>\
							</li>\
						</ul>\
				        <div class="clear"></div>\
					</li>';
		});
		
		if(Check.isEmpty(out)){
			out = '<li class="side-fleet-row"><span style="text-align:center;width:100%;">You don\'t have any fleet activity right now</span><a href="#" class="btn" style="display:block;clear:both;margin:0px auto;width:100px;height:20px;line-height:20px;padding:4px 10px;text-align:center;margin-bottom:10px;" onclick="Shipyard.init();">Send Fleet</a></li>';
		}
		$('#menu-right').html('<ul>'+out+'</ul>');
		
    },
    resetModals: function(){
	    $('.page-galaxy-page,.page-user-page,.page-alliance-page,.page-message-page,.page-cr-page,.page-help-page').css('z-index','');
    },
    showHelp:function(id){
	    id = typeof id !== 'undefined' ? id : 1;
	    
	    Request.send({'object':'page', 'action':'show', 'pid':id});
		if(responseObj.status != 100){
			alertify.alert(lang._T(responseObj.error));
			return false;
		}
		
		var back_link = '';
		if(!Check.isEmpty(responseObj.pageshow.back) && !Check.isEmpty(responseObj.pageshow.back.id)){
			back_link = '<< <a onclick="Overview.showHelp('+responseObj.pageshow.back.id+');">'+responseObj.pageshow.back.title+'</a> | ';
		}
		
		//links
		var links = '';
		foreach(responseObj.pageshow.pages, function(k, p){
			links += '<a onclick="Overview.showHelp('+p.id+');">'+p.title+'</a>';
		});
		
		var links_top = '';
		var links_bottom = '';
		if(responseObj.pageshow.link_position == 'top'){
			links_top = '<div class="help-page-links-top">'+links+'</div>';
		}else{
			links_bottom = '<div class="help-page-links-bottom">'+links+'</div>';
		}

		if(id == 1){
			links_bottom += '<div style="text-align:right; font-size:smaller; color:#aabbcc">Version: '+config.version+'</small>';
		}
		
		Modal.init(back_link+responseObj.pageshow.title, '<div class="user-profile">'+links_top+'<div class="help-page-middle">'+responseObj.pageshow.content+'</div>'+links_bottom+'</div>');
    }
};
