
//zingchart object
var jsonConfig = '{' +
    '"show-progress":false,' +
    '"graphset":[{' +
        '"alpha":1,' +
        '"background-color":"#eeeeee",' +
        '"background-color-2":"#eeeeee",' +
        '"border-color":"#000000",' +
        '"border-width":1,' +
        '"histogram":false,' +
        '"stacked":false,' +
        '"tooltip":{' +
            '"visible":true,' +
            '"text-align":"left"' +
        '},' +
        '"plotarea":{' +
            '"position":"0% 0%",' +
            '"alpha":1,' +
            '"background-color":"#ffffff",' +
            '"background-color-2":"#ffffff",' +
            '"margin-top":60,' +
            '"margin-right":50,' +
            '"margin-left":50,' +
            '"margin-bottom":65,' +
            '"border-color":"#000000",' +
            '"border-width":2,' +
            '"bevel":true,' +
            '"bevel-distance":2,' +
            '"bevel-blur-x":5,' +
            '"bevel-blur-y":5,' +
            '"bevel-angle":225' +
        '},' +
        '"title":{' +
            '"text":"Beeradvodate.com - Amperican IPA Ratings",' +
            '"position":"0% 0%",' +
            '"margin-top":10,' +
            '"margin-right":0,' +
            '"margin-left":0,' +
            '"margin-bottom":10,' +
            '"text-align":"center"' +
        '},' +
        '"type":"bar",' +
        '"plot":{' +
            '"animation":{' +
                '"delay": "250",' +
                '"effect": "ANIMATION_EXPAND_VERTICAL",' +
                '"method": "ANIMATION_REGULAR_EASE_OUT",' +
                '"sequence": "1",' +
                '"speed": "1000"' +
            '},' +
            '"highlight":false,' +
            '"tooltip-text":"%t, <b>%v</b>",' +
            '"value-box":{' +
                '"text":"%v"' +
            '},' +
            '"preview":false' +
        '},' +
        '"scale-x":{' +
            '"format":"",' +
            '"label":{' +
                '"text":"Rank"' +
            '},' +
            '"guide":{' +
                '"line-color":"#000000",' +
                '"line-width":1,' +
                '"line-gap-size":0' +
            '},' +
            '"tick":{' +
                '"size":5,' +
                '"line-color":"#000000",' +
                '"line-width":1,' +
                '"line-dotted":1,' +
                '"line-segment-size":1,' +
                '"line-gap-size":3' +
            '}' +
        '},' +
        '"scale-y":{' +
            '"label":{'+
                '"text":"Rating"' +
            '}'+
        '},' +
        '"series":[' +
            '{"values":[5],"text":"a"},' +
            '{"values":[5],"text":"b"},' +
            '{"values":[5],"text":"c"},' +
            '{"values":[5],"text":"d"},' +
            '{"values":[5],"text":"e"},' +
            '{"values":[5],"text":"f"},' +
            '{"values":[5],"text":"g"},' +
            '{"values":[5],"text":"h"},' +
            '{"values":[5],"text":"i"},' +
            '{"values":[5],"text":"j"} ' +
        ']' +
    '}]' +
'}';


$(document).ready(function() {
	$(window).load(function() {
	    $('#zingHeader>span').html(jsonBeer.status);
	    //fill select object
        for (var i=0; i<jsonBeer.category.length; i++) {
        	$('#beer_selector').append('<option value="'+i+'">'+jsonBeer.category[i].style+'</option>');
        }
	    //create zingchart
        zingchart.render({
            liburl:'zingchart/flash_scripts/zingchart.swf',
            data:jsonConfig,
            width:640,
            height:460,
            container:'zingchart'
        });
        //hide zingchart at startup
        $('#zingchart').css('visibility','hidden');
    });
    //beer type select object on change function
	$('#beer_selector').live('change',function() {
		var oList = $('#display_list');
		var oZing = $('#zingchart');
		//first option is not valid so hide chart & table if selected
		if ($(this).prop('selectedIndex')==0) {
			oList.html('');
			oZing.css('visibility','hidden');
		}
		//otherwise fill objects with beer list and zingchart
		else {
		    var val=$(this).val();
			oList.html(getBeerList(val));
			zingchart.exec('zingchart','modify','{"object":"title","data":'+getBeerChartTitle(val)+'}');
			zingchart.exec('zingchart','modify','{"data":'+getBeerChart(val)+'}');
			oZing.css('visibility','visible');
		}
	});
	//zingchart mouseover node will highlight ordered list items
	zingchart.node_mouseover=function(node) {
	    var oLi=$('ol.BeerList').find('li').eq(node["plotindex"]);
	    if (! oLi.hasClass('Hover')) oLi.addClass('Hover');
	};
	//zingchart mouseout node will return list item to non-mouseover state
	zingchart.node_mouseout=function(node) {
	    $('ol.BeerList').find('li').eq(node["plotindex"]).removeClass('Hover');
	};
});

//updates the zingchart data values
//returns a formatted string for 'modify' function
//requires index of select object
function getBeerChart(idx) {
    var str='{"series":[';
    var eachItem;    for (eachItem in jsonBeer.category[idx].details) {
        str+='{"values":['+jsonBeer.category[idx].details[eachItem].rating+'],'
            +'"text":'
            +'"<b>'+jsonBeer.category[idx].details[eachItem].name+'</b><br>'
            +jsonBeer.category[idx].details[eachItem].brewery+', '
            +jsonBeer.category[idx].details[eachItem].ABV+' ABV"},';
    }
    if (str.charAt(str.length-1)==',') str=str.substring(0,str.length-1);
    str+=']}';
    return str;
}

//updates the zingchart title
//returns a formatted string for 'modify' function
//requires index of select object
function getBeerChartTitle(idx) {
    return '{"text":'
        +'"Beeradvodate.com - '+jsonBeer.category[idx].style+' Ratings",'
        +'"position":"0% 0%",'
        +'"margin-top":10,'
        +'"margin-right":0,'
        +'"margin-left":0,'
        +'"margin-bottom":10,'
        +'"text-align":"center"}';
}

//creates the ordered list to display with zingchart
//returns an html string to be inserted into a containing tag
//requires index of select object
function getBeerList(idx) {
    var str="";
	str+="<ol class='BeerList'>";
	var eachItem;
	for (eachItem in jsonBeer.category[idx].details) {
		str+="<li>"
		    +"<span class='BeerName'>"+jsonBeer.category[idx].details[eachItem].name+"</span>"
			+jsonBeer.category[idx].details[eachItem].brewery+" / "
			+jsonBeer.category[idx].details[eachItem].style+" / "
			+jsonBeer.category[idx].details[eachItem].ABV+" ABV / "
			+"<span class='Rating'>"+jsonBeer.category[idx].details[eachItem].rating+"</span>"
			+"</li>";
	}
	str+="</ol>";
	return str;
}
