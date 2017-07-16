var width = 680;
var height = 500;
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var canvas = d3.select('#chart')
   .append('svg')
   .attr('width',width + 20)
   .attr('height',height + 20);
var tooltip = d3.select('body')
		.append('div')
		.style('position','absolute')
		.style('top','250px')
		.style('left','350px')
		.style('padding','5px')
		.style('width','180px')
		.style('opacity','0')
		.style('border','1px solid')
		.style('border-radius','5px')
		.style('background-color','rgba(0, 0, 0,0.2)');
var formateAxisDate = d3.timeFormat('%H : %M');
var formatToolTipDate = d3.timeFormat('%Y');

d3.json(url,function(err,data){
	if(err){
		console.log("some error occured as "+err);
		alert("Oops something went wrong!! Please try again.");
	}else{
		
		var yMax = data[0].Place;
		var yMin = data[data.length-1].Place;
		var fastestTime = data[0].Seconds;

		data.forEach(function(d){
			d.Remain = d.Seconds - fastestTime;
		});
		//axis scalling
		var xScale = d3.scaleLinear().domain([3.5*60,0]).range([0, width]);
		var yScale = d3.scaleLinear().domain([yMax,yMin+1]).range([0, height]);

		//axis and their orientations
		var yAxis = d3.axisLeft(yScale);
		var xAxis = d3.axisBottom(xScale)
				.ticks(6)
        .tickFormat(function(data){
        	var date = new Date(2017, 0, 1, 0, data);
        	return formateAxisDate(date.setSeconds(data+date.getSeconds()));
        });

		//append X & Y axis
		canvas.append('g')
		  .attr('transform','translate(0,'+height+')')
		  .call(xAxis);
		canvas.append('g').call(yAxis);

		//create circle's with correct color and plot them
		canvas.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', function(d){
				return xScale(d.Remain)
			})
			.attr('cy',function(d){
				return yScale(d.Place)
			})
			.attr('r',5)
			.attr('fill',function(d){
				if(d.Doping == '')
					return 'black';
				else
					return 'red';
			})
			.on('mouseover', function(d){
				var html = "<p>"+d.Name+": "+d.Nationality+"<br/>Year: "+d.Year+", Time: "+d.Time+"<br/>"+d.Doping+"</p>";
				tooltip.transition()
				  .duration(1)
				  .style('opacity',1)
				  .style('text-align','center');
				tooltip.html(html);
			})
			.on('mouseout', function(d){
				tooltip.transition()
				  .duration(1)
				  .style('opacity',0);
			});
		//text for the circle points
		canvas.append('g')
			.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text(function(d){
				return d.Name;
			})
			.attr('x',function(d){
				return xScale(d.Remain-3)
			})
			.attr('y',function(d){
				return yScale(d.Place+0.3)
			});
			
		canvas.append('g')
		  .append('text')
		  .text('Minutes Behind Fastest Time')
		  .attr('text-anchor','middle')
		  .attr('transform','translate('+(width/2)+'	,'+(height+35)+')')
		  .style('font-size','15px')
		  .style('font-weight','bold');
		canvas.append('g')
		  .append('text')
		  .text('Ranking')
		  .attr('text-anchor','middle')
		  .attr('transform','translate('+(-25)+'	,'+(height/2)+')rotate(-90)')
		  .style('font-size','15px')
		  .style('font-weight','bold');
		
		canvas.append('g')
		  .append('circle')
		  .attr('fill','black')
		  .attr('r',5)
		  .attr('cx',width-75)
		  .attr('cy',height/2)
		canvas.append('g')
		  .append('circle')
		  .attr('fill','red')
		  .attr('r',5)
		  .attr('cx',width-75)
		  .attr('cy',height/2 +20)
		canvas.append('g')
		  .append('text')
			.text('No doping allegations')
			.attr('x',width-65)
			.attr('y',height/2 + 4);
		canvas.append('g')
		  .append('text')
			.text('Riders with doping allegations')
			.attr('x',width-65)
			.attr('y',height/2 + 24);
		  
	}
});