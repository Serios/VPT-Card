console.info(`%c Varna PT card \n%c Version: ${'0.0.3'} `, 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
// #####
// ##### Get the LitElement and HTML classes from an already defined HA Lovelace class
// #####

const LitElement = window.LitElement || Object.getPrototypeOf( customElements.get("home-assistant-main"), );
const { html, css } = LitElement.prototype;



// #####
// ##### Custom Card Definition begins
// #####

class VarnaPublicTransportCard extends LitElement {

	version() { return "0.0.3"; }

	constructor () {
		super();
		this.stop_name;
		this.live_data = html ``;
		this.schedule_data = html ``;
	}
  
	static get properties() {
		return {
			_hass: Object,
			config: Object,
			entity: Object,
			live_data: Object,
			schedule_data: Object
		}
	}
	
	updated() {}


// #####
// ##### Define Render Template
// #####

    render() {
	
	this._StopName();
	this._ReturnLiveData();
	this._ReturnLinesSchedule();
	
	
// Build HTML    
      return html`
          <style>
            ${this.style()}
          </style>
          <ha-card class="card">
			${this.stop_name}
            ${this.live_data}
            ${this.schedule_data}
          </ha-card>
	    `;
     
    }
	
  
// #####
// ##### style: returns the CSS style classes for the card
// ####

    style() {
      return html`
		.card { margin: auto; padding-top: 1em;	padding-bottom: 1em; padding-left: 1em; padding-right: 1em; color: ${this.CustomStyle.VPTMainColor}; }
		.varna-pt-live { margin-bottom: 2em; border-top: 1px solid ${this.CustomStyle.VPTBordersColor}; }
		.varna-pt-schedules { border-top: 1px solid ${this.CustomStyle.VPTBordersColor}; padding-top: 5px; }
 		.varna-pt-table-row { display: flex; display: -webkit-flex; flex-direction: row; -webkit-flex-direction: row; flex-wrap: no-wrap;  -webkit-flex-wrap: no-wrap; }
 		.varna-pt-table-row { width: 100%; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid ${this.CustomStyle.VPTBordersColor}; }
		.varna-pt-wrapper { display: flex; display: -webkit-flex; flex-direction: row;  -webkit-flex-direction: row; width: 100%; }
		.varna-pt-attributes,
		.varna-pt-line-schedule-arrivesin-distance,
		.varna-pt-line-schedule,
		.varna-pt-arrivesin-distance { flex-grow: 1; -webkit-flex-grow: 1; display: flex-row; flex-shrink: 0; }
		.varna-pt-line-schedule { width: 60%; }
		.varna-pt-arrivesin-distance { width: 40%; }
		.varna-pt-column { flex-grow: 0;  -webkit-flex-grow: 0; flex-shrink: 0;  -webkit-flex-shrink: 0; vertical-align: top; }
		.varna-pt-line { display: flex; display: -webkit-flex; flex-grow: 1; width: 40%; align-items: center; }
		.varna-pt-schedule { flex-grow: 2; align-content: center; width: 60%; }
		.varna-pt-arrivesin { flex-grow: 1; width: 50%; text-align: center; font-size: 1.35em;  align-self: center; }
		.varna-pt-distance { flex-grow: 1; width: 50%; text-align: center; font-size: 1.3em; align-self: center; }
		.varna-pt-table-row .varna-pt-nolines { text-align: center; align-self: center; flex-grow: 1; width: 100%; }
		.varna-pt-line span { font-size: 1.6em; }
		.varna-pt-bus-arival-delay { display: flex; display: -webkit-flex; align-items: flex-start; font-size: 1.2em; line-height: 1.1em; }
		.varna-pt-schedule span { padding: 4px 3px; border: 1px solid ${this.CustomStyle.VPTDelayBorder}; background: ${this.CustomStyle.VPTDelayBG}; border-radius: 2px; font-size: 0.68em; line-height: 0.6em; margin-left: 5px; margin-top: 1px; font-weight: bold; }
		.varna-pt-schedule span { box-shadow: 0 1px 1px 0px rgba(0, 0, 0, 0.45); text-shadow: 0 0px 1px rgba(255, 255, 255, 0.45); }
		.varna-pt-bus-extras { width: 100%; color: ${this.CustomStyle.VPTSecondColor}; }
		.varna-pt-bus-extras ha-icon { width: 15px; height: 15px;}
		.varna-pt-table-row.varna-pt-header { background: ${this.CustomStyle.VPTHeaderBG}; align-items: center; padding: 3px 0; }
		.varna-pt-table-row.varna-pt-header .varna-pt-line,
		.varna-pt-table-row.varna-pt-header .varna-pt-schedule,
		.varna-pt-table-row.varna-pt-header .varna-pt-arrivesin,
		.varna-pt-table-row.varna-pt-header .varna-pt-distance { font-size: 0.9em!important; text-align: center; }
		.varna-pt-table-row.varna-pt-header .varna-pt-line { text-align: left; padding-left: 5px; }
		.varna-pt-line-schedule-item { display: flex; display: -webkit-flex; flex-direction: row;  -webkit-flex-direction: row; flex-wrap: no-wrap; -webkit-flex-wrap: no-wrap; } 
		.varna-pt-line-schedule-item { width: 100%; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid ${this.CustomStyle.VPTBordersColor}; align-items: center; } 
		.varna-pt-line-schedule-item .varna-pt-line-number { flex-grow: 1;  -webkit-flex-grow: 1; flex-shrink: 0;  -webkit-flex-shrink: 0; vertical-align: top;  width: 12%; font-size: 1.3em; text-align: center; }
		.varna-pt-line-schedule-item .varna-pt-schedule-times { flex-grow: 2;  -webkit-flex-grow: 2; flex-shrink: 0; -webkit-flex-shrink: 0; vertical-align: top; width: 88%; }
		.varna-pt-line-schedule-item .varna-pt-schedule-times .varna-pt-time {
			display: inline-block; color: ${this.CustomStyle.VPTSchePadText};
			padding: 4px 3px; border: 1px solid ${this.CustomStyle.VPTSchePadBorder}; 
			background: ${this.CustomStyle.VPTSchePadBG}; 
			border-radius: 2px; font-size: 0.8em; line-height: 0.65em; margin-left: 2px; margin-top: 1px; margin-bottom: 2px;
		} 
		.varna-pt-line-schedule-item .varna-pt-schedule-times .varna-pt-time { box-shadow: 0 1px 1px 0px rgba(0, 0, 0, 0.45); text-shadow: 0 0px 1px rgba(255, 255, 255, 0.45); } 
	    .islate { color: ${this.CustomStyle.VPTLateColor}; }
		.isearly { color: ${this.CustomStyle.VPTEarlyColor}; }
	  `;
    }
	
// #####
// ##### StopName : returns live data for the Bus stop
// #####
  _StopName() {
	var name = this._hass.states[this.config.entity].attributes["StopName"];
	this.stop_name = html`<h2 id='bus-stop-name'><ha-icon icon='mdi:sign-text'></ha-icon> ${this.GetLang.lang_bus_stop} "${name}"</h2>`;
  }
	
// #####
// ##### ReturnLiveData : returns live data for the Bus stop
// #####
  _ReturnLiveData() {
	
    var lines = this._hass.states[this.config.entity].attributes["lines"];	
	
	//Live data is disabled in sensor or doesn't load
	if (lines == undefined ) {
		this.live_data = html ``;
		return;
	}
	
	var BusLines = '';
	
	
	//empty - no buses going to this stop
	if (lines == 0 ) {
		
		BusLines = html`<div class='varna-pt-table-row'><div class='varna-pt-wrapper'><div class='varna-pt-column varna-pt-nolines'>${this.GetLang.lang_no_bus}</div></div></div>`;
		
	} else {
		
		var live_lines = this._hass.states[this.config.entity].attributes['stop_lines'];
		var LinesArray = [];
		
		if ( lines > 0 ) {
		  for (var i=0; i < lines; i++) {
			  LinesArray.push({
				'LineNumber': this.LineNumbers(live_lines['line_'+i]['LineNumber']),
				'arrivalTime': live_lines['line_'+i]['arrivalTime'],
				'distanceLeft': live_lines['line_'+i]['distanceLeft'],
				'arriveIn': live_lines['line_'+i]['arriveIn'],
				'delay': live_lines['line_'+i]['delay'],
				'vehicleKind': this.VehicleKind(live_lines['line_'+i]['vehicleKind']),
				'vehicleExtras': live_lines['line_'+i]['vehicleExtras'],
			  });
		  }
		}
		
		BusLines = html`
					  ${LinesArray.map((line) => html`
						<div class="varna-pt-table-row">
							<div class="varna-pt-wrapper varna-pt-attributes">
							      <div class="varna-pt-wrapper varna-pt-line-schedule-arrivesin-distance">
									<div class="varna-pt-wrapper varna-pt-line-schedule">
										<div class="varna-pt-column varna-pt-line">
											<ha-icon icon='mdi:${line.vehicleKind}'></ha-icon> <span>${line.LineNumber}</span> 
										</div>
										<div class="varna-pt-column varna-pt-schedule">
											<div class='varna-pt-bus-arival-delay'>
												${line.arrivalTime} ${this.DefineDelay(line.delay)}
											</div>	
											<div class='varna-pt-bus-extras'>
												${this.VehicleExtras(line.vehicleExtras).map((extra) => html`
													${extra}
												`)}
											</div>
										</div>
									</div>
									<div class="varna-pt-wrapper varna-pt-arrivesin-distance">
									 <div class="varna-pt-column varna-pt-arrivesin">${line.arriveIn}</div>
									 <div class="varna-pt-column varna-pt-distance">${line.distanceLeft}</div>
									</div>
								   </div>
							</div>
						</div>
					  `)}
					`;
		
	}
	
	//Live data table
	this.live_data = html `
				<div class="varna-pt-live">
                  <div class="varna-pt-table-row varna-pt-header">
					<div class="varna-pt-wrapper varna-pt-attributes">
						<div class="varna-pt-wrapper varna-pt-line-schedule-arrivesin-distance">
							<div class="varna-pt-wrapper varna-pt-line-schedule">
							 <div class="varna-pt-column varna-pt-line">${this.GetLang.lang_line_num}</div>
							 <div class="varna-pt-column varna-pt-schedule">${this.GetLang.lang_schedule}</div>
							</div>
							<div class="varna-pt-wrapper varna-pt-arrivesin-distance">
							 <div class="varna-pt-column varna-pt-arrivesin">${this.GetLang.lang_arrivesin}</div>
							 <div class="varna-pt-column varna-pt-distance">${this.GetLang.lang_distance}</div>
							</div>
						</div>
					</div>
				  </div>
                  <div id='varna-pt-live-data'>
						${BusLines}
                  </div>
                </div>
	`; 	
  }
  
// #####
// ##### ReturnLinesSchedule : returns bus lines schedule data for the Bus stop
// #####
  _ReturnLinesSchedule() {
    var lines = this._hass.states[this.config.entity].attributes["lines_schedules"];
	
	//lines schedule is disabled in sensor or doesn't load
	if (lines == undefined || lines == '' ) {
		this.schedule_data = html ``;
		return;
	}
	

	//empty - no buses going to this stop anymore
	if (lines == 0 ) {
		this.schedule_data = html``;
	} else {
		var schedule_lines = this._hass.states[this.config.entity].attributes['stop_lines_schedules'];
		var LinesArray = [];
		
		if ( lines > 0 ) {
		  for (var i=0; i < lines; i++) {
			  LinesArray.push({
				'line_number': this.LineNumbers(schedule_lines['line_'+i]['line_number']),
				'line_times': schedule_lines['line_'+i]['line_times'],
			  });
		  }
		}

		this.schedule_data = html`
					<div class='varna-pt-schedules'>	
					  ${LinesArray.map((line) => html`
								
									<div class='varna-pt-line-schedule-item'>
										<div class='varna-pt-line-number'>${line.line_number}</div>
										<div class='varna-pt-schedule-times'>
											${Object.keys(line.line_times).map((i) => html`
												<span class='varna-pt-time' style="white-space: nowrap;">${line.line_times[i]}</span> 
											`)}
										</div>
									</div>
					  `)}
					</div>
					`;
	}

  }
  
// #####
// ##### LineNumbers : returns proper line number, since Varna Traffic mark some of them in a diffrent way than the actual line number
// #####  
  LineNumbers(lineNumber) {
	var ActualLine;
	switch (lineNumber) {
        case 117:
			ActualLine = '17a';
        break;
        case 1018:
			ActualLine = '18a';
        break;
        case 131:
            ActualLine = '31a';
        break;
        case 1118:
            ActualLine = '118a';
        break;
        case 219:
			ActualLine = '209b';
        break;
		default:
			ActualLine = lineNumber;
	}
	
	return ActualLine;
  }
  
// #####
// ##### VehicleKind: returns proper icon for the vehicle type
// #####  
  VehicleKind(type) {
	var icon;
	switch (type) {
        case 0: //bus
			icon = 'bus';
        break;
        case 1: //trolley
			icon = 'tram'; //no icon for trolley we are using tram instead
        break;
        case 2: //eco bus
            icon = 'leaf';
        break;
		default:
			icon = 'bus';
	}
	
	return icon;
  }
  
// #####
// ##### DefineDelay: sets class depending if returned delay is with + (bus is early) or - (bus is late)
// #####  
  DefineDelay(delay) {
	if (delay == '') {
		return html``;
	}
	var delay_class;
	switch (delay.charAt(0)) {
        case '-': //bus
			delay_class = 'isearly';
        break;
        case '+': //trolley
			delay_class = 'islate';
        break;
		default:
			delay_class = '';
    }
	
	
	
	return html`<span class='bus-delay ${delay_class}'>${delay}</span>`;
  }
  
// #####
// ##### VehicleExtras: based on returned number, set proper icons for the vehicle extras
// #####  
  VehicleExtras(extrasFlags) {
	var returnextras = [];
	var hasFlag = function(a, b) {
            return(a&b)===b
    }	
		
    var extras = { DEVICE_EXTRA_AIRCONDITIONING:1, DEVICE_EXTRA_FORDISABLED:2, DEVICE_EXTRA_FORBLIND:4, DEVICE_EXTRA_WC:8 }
	
	if(hasFlag(extrasFlags, extras.DEVICE_EXTRA_AIRCONDITIONING)) {
		returnextras.push(
			html`<ha-icon icon='mdi:snowflake'></ha-icon>`
		);
	}
	
	if(hasFlag(extrasFlags, extras.DEVICE_EXTRA_FORDISABLED)) {
		returnextras.push(
			html`<ha-icon icon='mdi:wheelchair-accessibility'></ha-icon>`
		);
	}
	
	if(hasFlag(extrasFlags, extras.DEVICE_EXTRA_FORBLIND)) {
		returnextras.push(
			html`<ha-icon icon='mdi:eye-outline'></ha-icon>`
		);
	}
	
	if(hasFlag(extrasFlags, extras.DEVICE_EXTRA_WC)) {
		returnextras.push(
			html`<ha-icon icon='mdi:toilet'></ha-icon>`
		);
	}

	return returnextras;
  }
	
// #####
// ##### Assign the external hass object to an internal class var.
// ##### This is called everytime a state change occurs in HA
// #####
  
  set hass(hass) {
    const entity = hass.states[this.config.entity];
	this._hass = hass;	
    if (entity && this.entity !== entity)
      this.entity = entity;
  }
  

  shouldUpdate(changedProps) {
    const change = changedProps.has('entity') || changedProps.has('live_data') || changedProps.has('schedule_data') || changedProps.has('stop_name');
    return change;
  }
  
// #####
// ##### Assigns the configuration vlaues to an internal class var
// ##### This is called everytime a config change is made
// #####

  setConfig(config) { 
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
	
    this.config = config; 
  }
  
  
// #####
// ##### GetLang - returns language strings based on configured lang
// ##### default lang is English
// #####
  get  GetLang() { 
		switch (this.config.locale) {
		  case "bg" :
			return {
			  lang_line_num: "Ном:",
			  lang_schedule: "Разписание",
			  lang_arrivesin: "След",
			  lang_distance: "Дистанция",
			  lang_bus_stop: "Спирка",
			  lang_no_bus: "Няма автобуси, пътуващи към тази спирка",
			}
		  case "ru" :
			return {
			  lang_line_num: "Ном:",
			  lang_schedule: "Расписание",
			  lang_arrivesin: "Через",
			  lang_distance: "Расстояние",
			  lang_bus_stop: "Остановка",
			  lang_no_bus: "Нет автобусов едущих до этой остановки",
			}
		  default :
			return {
			  lang_line_num: "N:",
			  lang_schedule: "Schedule",
			  lang_arrivesin: "Arrives in",
			  lang_distance: "Distance",
			  lang_bus_stop: "Bus stop",
			  lang_no_bus: "There are no buses travelling toward that stop",
			}
		}
	}
	
	
// #####
// ##### CustomStyle - returns styles based on user defined in card config, defined in theme, or default ones if none of previuos are set
// #####
// #####
  get CustomStyle() { 
		if(this.config.vptstyles) {
			var styles = this.config.vptstyles;
		} else {
			var styles = {};
		}
		let VPTMainColor = getComputedStyle(document.body).getPropertyValue("--VPT-main-color");
		let VPTSecondColor = getComputedStyle(document.body).getPropertyValue("--VPT-secondary-color");
		let VPTHeaderBG = getComputedStyle(document.body).getPropertyValue("--VPT-header-background");
		let VPTBordersColor = getComputedStyle(document.body).getPropertyValue("--VPT-borders-color");
		
		let VPTDelayBG = getComputedStyle(document.body).getPropertyValue("--VPT-delay-background");
		let VPTDelayBorder = getComputedStyle(document.body).getPropertyValue("--VPT-delay-border");
		let VPTLateColor = getComputedStyle(document.body).getPropertyValue("--VPT-late-color");
		let VPTEarlyColor = getComputedStyle(document.body).getPropertyValue("--VPT-early-color");
		
		let VPTSchePadBG = getComputedStyle(document.body).getPropertyValue("--VPT-sche-pad-bg");
		let VPTSchePadBorder = getComputedStyle(document.body).getPropertyValue("--VPT-sche-pad-border");
		let VPTSchePadText = getComputedStyle(document.body).getPropertyValue("--VPT-sche-pad-text");
		
		return {
			"VPTMainColor": styles.VPTMainColor || VPTMainColor || "var(--primary-text-color)",
			"VPTSecondColor": styles.VPTSecondColor || VPTSecondColor || "var(--secondary-text-color)",
			"VPTHeaderBG": styles.VPTHeaderBG || VPTHeaderBG || "rgba(240,240,240, 0.5)",
			"VPTBordersColor": styles.VPTBordersColor || VPTBordersColor || "#dedede",
			
			"VPTDelayBG":  styles.VPTDelayBG || VPTDelayBG || "rgba(237,237,237, 0.5)",
			"VPTDelayBorder":  styles.VPTDelayBorder || VPTDelayBorder || "#414141",
			"VPTLateColor":  styles.VPTLateColor || VPTLateColor || "#b80000",
			"VPTEarlyColor":  styles.VPTEarlyColor || VPTEarlyColor || "#1b8e00",
			
			"VPTSchePadBG":  styles.VPTSchePadBG || VPTSchePadBG || "#ffffff",
			"VPTSchePadBorder":  styles.VPTSchePadBorder || VPTSchePadBorder || "#a1a1a1",
			"VPTSchePadText":  styles.VPTSchePadText || VPTSchePadText || "var(--primary-text-color)",
		}		
	}
  
  
// #####
// ##### Sets the card size so HA knows how to put in columns
// #####

  getCardSize() { 
	var live_lines = (this._hass.states[this.config.entity].attributes["lines"]) ? this._hass.states[this.config.entity].attributes["lines"] : 0;
	var schedule_lines = (this._hass.states[this.config.entity].attributes["lines_schedules"]) ? this._hass.states[this.config.entity].attributes["lines_schedules"] : 0;
	var card_size = live_lines + schedule_lines + 2

	return card_size 
  
  }  
  
}

customElements.define('varna-pt-stop-card', VarnaPublicTransportCard);
