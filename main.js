$( document ).ready(function() {
  	
  	$(".sportsListItem").click(function() {
  		$("#sportBtn").html($(this).text());

  		var leagues = new Array();
  		if ($(this).text().localeCompare("Baseball") == 0) {
  			leagues = ["MLB"];
		} else if ($(this).text().localeCompare("Basketball") == 0) { 
			leagues = ["NBA", "NCAAM", "NCAAW"];
		} else if ($(this).text().localeCompare("Hockey") == 0) { 
			leagues = ["NHL"];
		} else if ($(this).text().localeCompare("Soccer") == 0) { 
			leagues = ["WORLD CUP QUALIFYING - CONCACAF", "WORLD CUP QUALIFYING - CONMEBOL", "Men's International Friendly", "Premier League", "UEFA Europa League", "UEFA Champions League", "MLS", "Mexican Liga MX", "La Liga"];
		} else if ($(this).text().localeCompare("Tennis") == 0) { 
			leagues = ["TENNIS (M)", "TENNIS (W)"];
		} else if ($(this).text().localeCompare("Golf") == 0) { 
			leagues = ["GOLF (M)"];
		} else { 
			leagues = ["NASCAR"];
		}

		result = "";
		"<li><a href=\"#\">MLB</a></li>"
		for (i = 0; i < leagues.length; i++) { 
			result += "<li><a class=\"leagueListItem\" href=\"#\">";
		    result += leagues[i];
		    result += "</a></li>";
		}
		$("#leagueDropdown").html(result);
		$("#leagueBtn").html(leagues[0]);
		updateScoreBoard();
	});


  	$("#datepicker").datepicker({changeMonth: true,changeYear: true, dateFormat: 'yymmdd'}).hide();

    $("#dateIcon").click(function() {
       $("#datepicker").toggle();

       if (!$("#datepicker").is(":visible"))
       {
       		generateDateSlides();
       } 
    });

    $(document).on('click', '.game-card-container', function(){ 
	     $("#playByPlay").click();
	 });

	$(document).on('click', '.leagueListItem', function(){ 
	     $("#leagueBtn").html($(this).text());
	     updateScoreBoard();
	 });

	$("#prevBtn").click(function(){
		setNewDate(-1);
	});

	$("#nextBtn").click(function(){
		setNewDate(1);
	});

	function updateScoreBoard()
	{
		var sport = $("#sportBtn").text().toLowerCase();
		var leagueId = getLeagueIdByLeagueName($("#leagueBtn").text()).toLowerCase();
		var date = $("#datepicker").val();
		
		var url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport=" + sport + "&league=" + leagueId + "&lang=en&region=us";
		if (sport.localeCompare("basketball") == 0 || sport.localeCompare("hockey") == 0 || sport.localeCompare("baseball") == 0)
		{
			url = "http://site.api.espn.com/apis/v2/scoreboard/header?sport=" + sport + "&league=" + leagueId + "&dates=" + date + "&lang=en&region=us";
		}
		$.ajax({
		     async: false,
		     type: 'GET',
		     url: url,
		     success: function(data) {
		     	$("#gameDetailContainer").html("");
		        games = data.sports[0].leagues[0].events;
				for (var i = 0; i < games.length; i++) {
				    game = games[i];
				    $("#gameDetailContainer").append(getGameDetail(games[i]));

				}
		     }
		});
	}

	function getGameDetail(game)
	{
		gameDate = game.date.split("T")[1].substring(0, 5);
	    gameCompetitor1Score = game.competitors[0].score;
	    gameCompetitor1Abbrev = game.competitors[0].abbreviation;
	    gameCompetitor1Name = game.competitors[0].name;
	    gameCompetitor1Logo = game.competitors[0].logo;

	    gameCompetitor2Score = game.competitors[1].score;
	    gameCompetitor2Abbrev = game.competitors[1].abbreviation;
	    gameCompetitor2Name = game.competitors[1].name;
	    gameCompetitor2Logo = game.competitors[1].logo;

	    result = "<section class=\"col-xs-12 col-sm-6 col-xlg-4 score-box-container score-box-bottom-margin\"><div class=\"game-card-container\"><div></div><div class=\"game-card-inner-container\"><div class=\"row\"><div class=\"col-xs-9 scores-teams\">";

        result += "<div class=\"team-container team-container-1\"><div class=\"scores-team-logo\"><a href=\"#\"><img class=\"float-left img-responsive\" src=\"" + gameCompetitor1Logo + "\" width=\"40\" height=\"40\"></a></div><div class=\"team-text-container\">";
        result += "<span class=\"scores-team-city\">" + gameCompetitor1Abbrev + "</span><br><span class=\"scores-team-name\">" + gameCompetitor1Name + "</span></div><div class=\"team-score-container\">";
        result += "<div class=\"scores-team-score score-winner\">" + gameCompetitor1Score + "</div><div class=\"scores-team-chevron\"></div></div><div class=\"clearfix\"></div></div>";                                                   
                                                
        result += "<div class=\"team-container team-container-2\"><div class=\"scores-team-logo\"><a href=\"#\"><img class=\"float-left img-responsive\" src=\"" + gameCompetitor2Logo + "\" width=\"40\" height=\"40\"></a></div><div class=\"team-text-container\">";
        result += "<span class=\"scores-team-city\">" + gameCompetitor2Abbrev + "</span><br><span class=\"scores-team-name\">" + gameCompetitor2Name + "</span></div><div class=\"team-score-container\">";
        result += "<div class=\"scores-team-score score-loser\">" + gameCompetitor2Score + "</div><div class=\"scores-team-chevron\"></div></div><div class=\"clearfix\"></div></div>";                                  

        result += "</div><div class=\"col-xs-3 scores-game-status\"><table><tbody><tr><td><div class=\"game-status\">" + gameDate + "</div><div class=\"network-logo\"></div></td></tr></tbody></table></div></div><div class=\"game-card-inner-container-fade\"></div></div><div class=\"clearfix\"></div></div></section>";                                                               
                                                
        return result;

	}

	function getLeagueIdByLeagueName(leagueName)
	{
  		if (leagueName.localeCompare("NCAAM") == 0) {
  			return "mens-college-basketball";
		} else if (leagueName.localeCompare("NCAAW") == 0) { 
			return "womens-college-basketball";
		} else if (leagueName.localeCompare("WORLD CUP QUALIFYING - CONCACAF") == 0) { 
			return "fifa.worldq.concacaf";
		} else if (leagueName.localeCompare("WORLD CUP QUALIFYING - CONMEBOL") == 0) { 
			return "fifa.worldq.conmebol";
		} else if (leagueName.localeCompare("Men's International Friendly") == 0) { 
			return "fifa.friendly";
		} else if (leagueName.localeCompare("Premier League") == 0) { 
			return "eng.1";
		} else if (leagueName.localeCompare("UEFA Europa League") == 0) { 
			return "uefa.europa";
		} else if (leagueName.localeCompare("UEFA Champions League") == 0) { 
			return "uefa.champions";
		} else if (leagueName.localeCompare("MLS") == 0) { 
			return "usa.1";
		} else if (leagueName.localeCompare("Mexican Liga MX") == 0) { 
			return "esp.1";
		} else if (leagueName.localeCompare("La Liga") == 0) { 
			return "usa.1";
		} else if (leagueName.localeCompare("TENNIS (M)") == 0) { 
			return "atp";
		} else if (leagueName.localeCompare("TENNIS (W)") == 0) { 
			return "wta";
		} else if (leagueName.localeCompare("GOLF (M)") == 0) { 
			return "pga";
		} else if (leagueName.localeCompare("NASCAR") == 0) { 
			return "sprint";
		} else {
			return leagueName
		}
	}

	function setNewDate(difference)
	{
		var date = $("#datepicker").datepicker('getDate');
		var day  = date.getDate() + difference;
		var month = date.getMonth() + 1;             
        var year =  date.getFullYear();

        if(day < 1)
		{
			month -= 1;
			day = new Date(year, month-2, 0).getDate();
		}
		else if (day > new Date(year, month-1, 0).getDate())
		{
			day -= new Date(year, month-1, 0).getDate();
			month += 1;
		}

		$('#datepicker').datepicker("setDate", new Date(year,month-1,day));
		generateDateSlides();

	}

	function generateDateSlides(){
		$(".slick-track").html("");
        for (i = 0; i < 7; i++) { 
        	$(".slick-track").append(getDateDivByIndex(i-3));
		}
		updateScoreBoard();
	}

	function getDateDivByIndex(index)
	{
		var date = $("#datepicker").datepicker('getDate');
		var day  = date.getDate();
		var month = date.getMonth()+1;             
        var year =  date.getFullYear();
		var currentYear = year;
		var currentMonth = month;
		var currentDay = day + index;

		if(currentDay < 1)
		{
			currentMonth -= 1;
			currentDay += new Date(currentYear, currentMonth-2, 0).getDate();
		}
		else if (currentDay > new Date(currentYear, currentMonth-1, 0).getDate())
		{
			currentDay -= new Date(currentYear, currentMonth-1, 0).getDate();
			currentMonth += 1;
		}
		currentDateClass = "";
		if(index == 0)
		{
			currentDateClass = "active";
		}

		var id = currentYear.toString() + "-" + currentMonth.toString() + "-" + currentDay.toString();
		var days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'];
		var currentDate = new Date(currentYear, currentMonth, currentDay);
		var dayOfTheWeek = days[new Date(currentYear, currentMonth-1, currentDay).getDay()];
		return "<div id=\"" + id + "\" class=\"day slick-slide\" style=\"width: 36px;\"><a class=\"" + currentDateClass + "\" href=\"#\">" + dayOfTheWeek + " <span>" + currentDay.toString() + "</span></a></div>";
	}

	generateDateSlides();
});



//NHL
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=hockey&league=nhl&dates=20160329&lang=en&region=us

//MLB
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=baseball&league=mlb&dates=20160329&lang=en&region=us

//NBA
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=nba&dates=20160329&lang=en&region=us

//NCAAM
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=mens-college-basketball&dates=20160327&lang=en&region=us

//NCAAW
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=womens-college-basketball&dates=20160327&lang=en&region=us

//WORLD CUP QUALIFYING - CONCACAF
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=fifa.worldq.concacaf&dates=20150331&lang=en&region=us

//WORLD CUP QUALIFYING - CONMEBOL 
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=fifa.worldq.conmebol&lang=en&region=us

//Men's International Friendly
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=fifa.friendly&lang=en&region=us

//Premier League
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=eng.1&lang=en&region=us

//UEFA Europa League
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=uefa.europa&lang=en&region=us

//UEFA Champions League
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=uefa.champions&lang=en&region=us

//MLS 
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=usa.1&lang=en&region=us 

//Mexican Liga MX
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=mex.1&dates=20160326&lang=en&region=us

//La Liga
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=soccer&league=esp.1&lang=en&region=us

//TENNIS (M)
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=tennis&league=atp&dates=20160329&lang=en&region=us

//TENNIS (W)
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=tennis&league=wta&dates=20160329&lang=en&region=us

//GOLF (M)
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=golf&league=pga&lang=en&region=us

//NASCAR
//http://site.api.espn.com/apis/v2/scoreboard/header?sport=racing&league=sprint&lang=en&region=us
