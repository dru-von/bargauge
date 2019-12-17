
dvGauge = function(jConfig){
    if(jConfig === null || jConfig === undefined){
        console.log('No configuration found');
        return False;
    };

    var obj = this;
    var svg = 'http://www.w3.org/2000/svg';

    jDefaults = {
        id : null,
        tg_hi : '',
        tg_lo : '',
        trip_hi: '',
        trip_lo: '',
        label : '',
        units : '',
        max : 100,
        min : 0,
        value : 50,
        tg_color : '#00b894',
        trip_color : '#e17055',
        middle_color : '#40739e',
        pointer_color: '#2d3436'
    };

    obj.config = {
        id : checkSet('id','float',jConfig),
        tg_hi : checkSet('tg_hi','float',jConfig),
        tg_lo : checkSet('tg_lo','float',jConfig),
        label : checkSet('label','float',jConfig),
        units : checkSet('units','float',jConfig),
        max : checkSet('max','float',jConfig),
        min : checkSet('min','float',jConfig),
        trip_hi: jConfig['trip_hi'] === null || jConfig['trip_hi']===undefined ? checkSet('max','float',jConfig) : checkSet('trip_hi','float',jConfig),
        trip_lo: jConfig['trip_lo'] === null || jConfig['trip_lo']===undefined ? checkSet('min','float',jConfig) : checkSet('trip_lo','float',jConfig),
        value : checkSet('value','float',jConfig),
        tg_color : checkSet('tg_color','float',jConfig),
        trip_color : checkSet('trip_color','float',jConfig),
        middle_color : checkSet('middle_color','float',jConfig),
        pointer_color: checkSet('pointer_color','string',jConfig)
    };

    function checkSet(prop, type, config){
        if(prop in config){
            return config[prop];
        }
        else{
            return jDefaults[prop];
        }
    };

    obj.jBarCreate = {
        'base':{
            'width':'100',
            'height':'200'
            },
        'bar_group':{
            'width':'40',
            'height':'160',
            'x':'30',
            'y':'35'
            },
        'base_bar':{
            'width':'100%',
            'height':'100%',
            'fill':obj.config['middle_color']
            },
        'tg_bar':{
            'width':'100%',
            'height': scaleTo(obj.config['tg_hi'],obj.config['min'],obj.config['max'],0,160) - scaleTo(obj.config['tg_lo'],obj.config['min'],obj.config['max'],0,160),
            'y': 160 - scaleTo(obj.config['tg_hi'],obj.config['min'],obj.config['max'],0,160),
            'fill':obj.config['tg_color']
            },
        'trip_hi_bar':{
            'width':'100%',
            'height': 160 - scaleTo(obj.config['trip_hi'],obj.config['min'],obj.config['max'],0,160),
            'y': 0,
            'fill':obj.config['trip_color']
        },
        'trip_lo_bar':{
            'width':'100%',
            'height': scaleTo(obj.config['trip_lo'],obj.config['min'],obj.config['max'],0,160) - scaleTo(obj.config['min'],obj.config['min'],obj.config['max'],0,160),
            'y': 160 - scaleTo(obj.config['trip_lo'],obj.config['min'],obj.config['max'],0,160),
            'fill':obj.config['trip_color']
        },
        'pointer_group':{
            'width':'40',
            'height':'40',
            'y': (160 - 7 - scaleTo(obj.config['value'],obj.config['min'],obj.config['max'],0,160)).toString(),
            'id':obj.config['id']+'-pointer'
            },
        'pointer_line':{
            'xl':'0',
            'x2':'40',
            'y1':'7',
            'y2':'7',
            'stroke':obj.config['pointer_color'],
            'stroke-width':'2'
            },
        'pointer_tri':{
            'points':'0,0 14,7 0,14',
            'fill':obj.config['pointer_color'],
            },
        'label':{
            'text-anchor':'middle',
            'x':'50',
            'y':'12',
            },
        'txt_val':{
            'text-anchor':'middle',
			'font-weight': 'bold',
            'x':'50',
            'y':'30',
            'id': obj.config['id'] + '-txtval'
            },
        };

    function addSVG(config, ns_type){
        var node = document.createElementNS(svg, ns_type);
        for(var prop in config){
            node.setAttribute(prop,config[prop]);
        }
        return node;
    };

    function buildBar(){
        var node = document.getElementById(obj.config['id']);
        var base = addSVG(obj.jBarCreate['base'],'svg');
        var bar_group = addSVG(obj.jBarCreate['bar_group'],'svg');
        var base_bar = addSVG(obj.jBarCreate['base_bar'],'rect');
        var point_group = addSVG(obj.jBarCreate['pointer_group'],'svg');
        var pointer_line = addSVG(obj.jBarCreate['pointer_line'],'line');
        var pointer_tri = addSVG(obj.jBarCreate['pointer_tri'],'polygon');
        var trip_hi_bar = addSVG(obj.jBarCreate['trip_hi_bar'],'rect');
        var trip_lo_bar = addSVG(obj.jBarCreate['trip_lo_bar'],'rect');
        var label = addSVG(obj.jBarCreate['label'],'text');
        label.innerHTML = obj.config['label'];
        var txt_val = addSVG(obj.jBarCreate['txt_val'],'text');
        txt_val.innerHTML = obj.config['value'].toFixed(1).toString() + '&nbsp;' + obj.config['units'];

        if(obj.config['tg_lo']){
            var tg_bar = addSVG(obj.jBarCreate['tg_bar'],'rect');
        } 

        bar_group.appendChild(base_bar);
        if(obj.config['tg_lo']){
            bar_group.appendChild(tg_bar);
        }
        bar_group.appendChild(trip_hi_bar);
        bar_group.appendChild(trip_lo_bar);
        point_group.appendChild(pointer_line);
        point_group.appendChild(pointer_tri);
        bar_group.appendChild(point_group);
        base.appendChild(bar_group);
        base.appendChild(label);
        base.appendChild(txt_val);
        node.appendChild(base);
        
        console.log(obj.config);        
    };

    buildBar();

    
};

dvGauge.prototype.refresh = function(value){
    console.log('made it');
    var obj = this;
    obj.config['value'] = value;
    var node = document.getElementById(obj.jBarCreate['pointer_group']['id']);
    node.setAttribute('y',(160 - 7 - scaleTo(obj.config['value'],obj.config['min'],obj.config['max'],0,160)).toString());
    var txtnode = document.getElementById(obj.jBarCreate['txt_val']['id']);
    txtnode.innerHTML = obj.config['value'].toFixed(1).toString() + '&nbsp;' + obj.config['units'];
};

//helper functions 

function scaleTo(x, x1, x2, y1, y2){
    var m = (y2-y1)/(x2-x1);
    var b = y1 - m * x1;
    return x*m+b;
};